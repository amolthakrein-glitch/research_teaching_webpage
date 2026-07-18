#!/usr/bin/env python3
"""Sync course materials from Upload dir to materials/ and rebuild manifest."""

import argparse
import json
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

UPLOAD_DIR = Path.home() / "home/Academics_Education/resources/Upload"
REPO = Path(__file__).resolve().parent
MATERIALS = REPO / "materials"
MANIFEST = MATERIALS / "manifest.json"

def prettify_stem(stem):
    """Replace -_ with spaces, title-case, uppercase special tokens."""
    special = {"jee", "neet", "pdf", "cbse", "ncert"}
    parts = stem.replace("-", " ").replace("_", " ").split()
    return " ".join(
        p.upper() if p.lower() in special else p.title()
        for p in parts
    )

def sync_materials(dry_run=False):
    """Scan UPLOAD_DIR, copy to MATERIALS, return (new_count, updated_count)."""
    new_count = 0
    updated_count = 0

    if not UPLOAD_DIR.exists():
        return new_count, updated_count

    # Collect files: immediate subfolders are tracks, root files are "common"
    to_copy = []  # (src, track, dst, is_new)

    for item in UPLOAD_DIR.iterdir():
        if item.name.startswith("."):
            continue
        if item.is_dir():
            track = item.name
            for file in item.iterdir():
                if not file.is_file() or file.name.startswith("."):
                    continue
                dst = MATERIALS / track / file.name
                to_copy.append((file, track, dst))
        elif item.is_file():
            track = "common"
            dst = MATERIALS / track / item.name
            to_copy.append((item, track, dst))

    # Copy or skip based on existence/size
    for src, track, dst in to_copy:
        is_new = not dst.exists()
        size_differs = dst.exists() and dst.stat().st_size != src.stat().st_size

        if not is_new and not size_differs:
            continue  # skip: already exists with same size

        if dry_run:
            print(f"[dry-run] copy: {src} → {dst}")
            if is_new:
                new_count += 1
            else:
                updated_count += 1
        else:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            if is_new:
                new_count += 1
            else:
                updated_count += 1

    return new_count, updated_count

def rebuild_manifest():
    """Rebuild manifest from MATERIALS on disk. Return True if changed."""
    existing = {}
    if MANIFEST.exists():
        try:
            with open(MANIFEST) as f:
                existing = json.load(f)
        except (json.JSONDecodeError, IOError):
            existing = {}

    # Tracks = existing keys + subdirs with files
    tracks = set(existing.keys())
    if MATERIALS.exists():
        for subdir in MATERIALS.iterdir():
            if subdir.is_dir() and not subdir.name.startswith("."):
                if any(f.is_file() and not f.name.startswith(".") for f in subdir.iterdir()):
                    tracks.add(subdir.name)

    manifest = {}
    for track in sorted(tracks):
        track_dir = MATERIALS / track
        entries = []
        if track_dir.exists():
            for file in sorted(track_dir.iterdir()):
                if file.is_file() and not file.name.startswith(".") and file.name != "manifest.json":
                    mtime = datetime.fromtimestamp(file.stat().st_mtime)
                    date_str = mtime.strftime("%Y-%m-%d")
                    entries.append({
                        "name": prettify_stem(file.stem),
                        "file": f"materials/{track}/{file.name}",
                        "size": file.stat().st_size,
                        "date": date_str,
                    })
        manifest[track] = sorted(entries, key=lambda e: e["name"])

    # Compare serialized text before write
    new_text = json.dumps(manifest, indent=4) + "\n"
    old_text = ""
    if MANIFEST.exists():
        try:
            with open(MANIFEST) as f:
                old_text = f.read()
        except IOError:
            pass

    changed = new_text != old_text
    if changed:
        MANIFEST.parent.mkdir(parents=True, exist_ok=True)
        with open(MANIFEST, "w") as f:
            f.write(new_text)

    return changed

def main():
    parser = argparse.ArgumentParser(description="Sync course materials and rebuild manifest.")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be copied, do nothing.")
    args = parser.parse_args()

    new_count, updated_count = sync_materials(dry_run=args.dry_run)

    if not args.dry_run:
        manifest_changed = rebuild_manifest()
    else:
        manifest_changed = False

    # Per-track counts
    per_track = {}
    if MATERIALS.exists():
        for track_dir in MATERIALS.iterdir():
            if track_dir.is_dir() and not track_dir.name.startswith("."):
                count = len([f for f in track_dir.iterdir() if f.is_file() and not f.name.startswith(".")])
                if count > 0:
                    per_track[track_dir.name] = count

    if new_count == 0 and updated_count == 0 and not manifest_changed:
        print("nothing to publish")
        return

    print(f"synced: {new_count} new, {updated_count} updated")
    for track in sorted(per_track.keys()):
        print(f"  {track}: {per_track[track]} files")

    if args.dry_run:
        return

    publish(new_count, updated_count)


def git(*args_, capture=False):
    return subprocess.run(["git", "-C", str(REPO), *args_],
                          check=True, text=True,
                          capture_output=capture)


def publish(new_count, updated_count):
    """Commit materials/ and push — GitHub Pages deploys on push."""
    dirty = git("status", "--porcelain", "materials/", capture=True).stdout.strip()
    if not dirty:
        print("nothing to publish (git clean)")
        return
    git("add", "materials/")
    git("commit", "-m", f"chore: publish materials (+{new_count} new, {updated_count} updated)")
    git("push")
    head = git("rev-parse", "HEAD", capture=True).stdout.strip()
    branch = git("rev-parse", "--abbrev-ref", "HEAD", capture=True).stdout.strip()
    remote = git("ls-remote", "origin", branch, capture=True).stdout.split()
    if remote and remote[0] == head:
        print(f"published: {head[:8]} on origin/{branch} — site updates in ~1 min")
    else:
        print(f"WARNING: push not verified — remote {remote[:1]} != HEAD {head[:8]}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
