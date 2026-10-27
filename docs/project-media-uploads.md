# Project photos and videos

In **Admin → Projects**, choose **Photos & videos** under a project's name. Select **Upload photos & videos** and select several files, or drop them into the upload area. After uploading, choose a cover, arrange the gallery, and select **Save media**.

New projects also include the uploader in **New project**. Create the draft to save its gallery.

- Photos: PNG, JPG, WebP, or GIF, up to 10 MB per file.
- Videos: MP4 or WebM, up to 60 MB per file in the project editor.
- Uploads use the authenticated backend and Cloudinary. API secrets stay on the server.
- A failed file does not stop the remaining files. **Retry failed uploads** retries only unsuccessful files.
- Gallery saves update only media and the cover; they preserve the project's title, publication, placement, and case study.
- Removing an item detaches it from the project. It does not delete a potentially shared Cloudinary asset.

The backend requires `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Its optional `VIDEO_UPLOAD_MAX_MB` setting may restrict videos further. The frontend proxy allows 64 MB requests so an individual 60 MB video has room for multipart headers.

The database must include migration `20261025000000_project_media_and_placement`. From `my_portfolio_website`, apply existing migrations with `npm.cmd run prisma:deploy --workspace backend` on Windows, or `npm run prisma:deploy --workspace backend` elsewhere. The configured database was checked during this change and had no pending migrations.

Verification covers mixed galleries, retained metadata and order, retries, validation, upload errors, and gallery-only saves using mocked uploads. No real project photo or video was uploaded during development.
