Brand assets for OnePage Alpha.

Logo_OnePage_Alpha.png
  - The site logo (wide ~3:1 horizontal lockup: icon + "OnePage Alpha").
  - White background was knocked out to transparent so it sits cleanly on the
    ivory header and white footer. Downscaled to 900x300 for fast loading.
  - Referenced via LOGO_PATH in lib/config.ts and used by components/BrandLogo.tsx.

To replace the logo later:
  1. Drop the new file here (keep a transparent background if possible).
  2. If the extension changes, update LOGO_PATH in lib/config.ts.

Favicon: a square version of the icon mark was cropped from this logo and saved
to app/icon.png (browser favicon) and app/apple-icon.png (iOS), both auto-detected
by Next.js. Regenerate those if the logo's icon mark changes.
