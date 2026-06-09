from playwright.sync_api import sync_playwright
import os

base = os.path.abspath(".")
index_url = f"file://{base}/index.html"
campaign_url = f"file://{base}/campaign.html"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # ── Desktop ──
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(index_url)
    page.wait_for_load_state("networkidle")
    page.screenshot(path="/tmp/verify_desktop.png", full_page=True)
    grid = page.locator(".bento-grid")
    print(f"[Desktop] bento-grid display: {grid.evaluate('el => getComputedStyle(el).display')}")

    # Verify chatbot button aria-label
    btn = page.locator("#chatbot-button")
    aria = btn.get_attribute("aria-label")
    print(f"[Desktop] chatbot aria-label: {aria}")

    # ── Tablet ──
    page.set_viewport_size({"width": 800, "height": 900})
    page.goto(index_url)
    page.wait_for_load_state("networkidle")
    page.screenshot(path="/tmp/verify_tablet.png", full_page=True)
    cols = grid.evaluate("el => getComputedStyle(el).gridTemplateColumns")
    print(f"[Tablet] bento-grid columns: {cols}")

    # ── Mobile ──
    page.set_viewport_size({"width": 375, "height": 812})
    page.goto(index_url)
    page.wait_for_load_state("networkidle")
    page.screenshot(path="/tmp/verify_mobile.png", full_page=True)
    cols_m = grid.evaluate("el => getComputedStyle(el).gridTemplateColumns")
    print(f"[Mobile] bento-grid columns: {cols_m}")

    # ── Campaign page ──
    page.set_viewport_size({"width": 1440, "height": 900})
    page.goto(campaign_url)
    page.wait_for_load_state("networkidle")
    page.screenshot(path="/tmp/verify_campaign.png", full_page=True)
    btn_el = page.locator(".back-to-profile")
    btn_boxes = btn_el.bounding_box()
    if btn_boxes:
        print(f"[Campaign] back-to-profile width: {btn_boxes['width']:.0f}px")

    # ── Campaign mobile ──
    page.set_viewport_size({"width": 375, "height": 812})
    page.goto(campaign_url)
    page.wait_for_load_state("networkidle")
    page.screenshot(path="/tmp/verify_campaign_mobile.png", full_page=True)
    btn_boxes2 = btn_el.bounding_box()
    if btn_boxes2:
        print(f"[Campaign Mobile] back-to-profile width: {btn_boxes2['width']:.0f}px")

    browser.close()

print("\nAll screenshots saved. Verify manually at:")
print("  /tmp/verify_desktop.png")
print("  /tmp/verify_tablet.png")
print("  /tmp/verify_mobile.png")
print("  /tmp/verify_campaign.png")
print("  /tmp/verify_campaign_mobile.png")
