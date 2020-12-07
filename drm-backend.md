Title: Working with libdrm (Part I)
Date: 2020-11-13
Tags: linux

As the taiwins project finished with X11/Wayland backend rigging. Now I am fully
on the libdrm backend development, dealing with hardwares directly. This backend
requires 200 percent my energy to tame the complexity.

Like other backends, libdrm also needs to provide two resources, *input* and
*output*. Backends like nested wayland backend or X11 backend, the *output*
device are the windows created by ourselves (or by the user). Meaning we can
create it or destroy it as we please. As for libdrm, those are provided by the
OS. An *output* in libdrm's terminology, is called connector. We query and
change the connectors state by `drmModeGet*` functions. Then later set the
hardware states by `drmModeSet*` or the new atomic API. It may sound simple but
actually, for displaying images on the screen using the *libdrm* mechanism, it
takes quite a few components, working together, to achieve the goal. We uses
`drmMode*` routines for
[kernel-modesetting](https://01.org/linuxgraphics/gfx-docs/drm/gpu/drm-kms.html);
libgbm for framebuffer allocation; OpenGL or Vulkan for rendering. If done
right, you would get tear-free images on your screen constant refresh rate. But
should anything goes wrong, you probably end up with a black screen.

I plan to create this series of blog of libdrm while I work on the taiwins
drm-backend. Hopefully by the end of the month, I would have all the pieces
together. In this **Part I**, we will look at the drm repainting loop.

### DRM repaint timeline
Knowing vaguely the concepts is not sufficient to come up with a working setup,
we want to know **WHEN** to do **WHAT** in order to get things right.

For a real world reference, here I steal an image[^1] of the weston repaint
timeline.

![weston-repaint-timeline]({static}/imgs/weston-timeline.png)

We can see from the image, during every frame, the compositor does its rendering
and tries to hit the [vblank](https://en.wikipedia.org/wiki/VBI) for displaying
the result. the *vblank* is a timestamp here, it is used to be a period where
the CRT monitors move electron gun from the bottom to the top. It is also the
period for setting gamma and swapping image buffer. For now we just need to know
that at *vblank*, there is a buffer swapping, also called *page-flip*.

If a client has double-buffering, it would want to

1. Before *vblank*, draw on the back-buffer.
2. After *vblank*, the back-buffer was used and it can draw on the new buffer.

Translating into code(here we use `drmWaitBlank`):

```
do {
	drmVBlank vbl = {
		.request.type = DRM_VBLANK_RELATIVE,
		.request.sequence = 1,
	};
	drmWaitVBlank(fd, &vbl); 	//fd is the opened GPU
	//vblank returns, with the timestamp
	struct timespec spec = {
		.tv_sec = vbl.reply.tval_sec,
		.tv_nsec = vbl.reply.tval_usec * 1000,
	};
	// repaint with new frame, return with new frame buffer, 
	int fb_id = repaint();
	//tell drm to use the new fb_id on present
	drmModeSetCrtc(fd, crtc_id, fb_id, 0,0, conn_id, mode);
	send_present_event(&spec);
	
} while (!quit);
```

In the snippet above, we wait for a vblank, then render and setCrtc in one
shot. The obvious problem here is we have control of the duration of the
rendering, it could exceed the vblank time window. Also there is a time we are
waiting for nothing. This is not exactly what we want, luckly libdrm has a
`drmModePageFlip` we can use.

```
static void handle_page_flip(int fd, unsigned int frame,
				             unsigned int sec, unsigned int usec,
				             void *data)
{
	int fb_id = repaint();
	struct timespec spec = {
		.tv_sec = sec,
		.tv_nsec = usec * 1000,
	};	
	drmModePageFlip(fd, crtc_id, fb_id, DRM_MODE_PAGE_FLIP_EVENT, data);
	send_present_event(&spec);
}

while(!quit) {
	drmEventContext ev = {
		.version = 2,
		.page_flip_handler = handle_page_flip,
	};
	poll(fd); //the opend gpu.
	drmHandleEvent(fd, &ev);
}
```

This is a better example, which I modified from here[^2]. This time we drawing
on demand, using the non blocking `drmModePageFlip` to set buffer on next
vblank. Note that the flag `DRM_MODE_PAGE_FLIP_EVENT` request the new page flip
events for drawing, without it, we would not get notified. The potential problem
is we may miss the next vblank if rendering takes too long (Triple-buffering
with multi-threads could help).

[^1]: [Weston repaint
    scheduling](https://ppaalanen.blogspot.com/2015/02/weston-repaint-scheduling.html)
    from Pekka Paalanen.
[^2]:
    [modeset-vsync](https://github.com/dvdhrm/docs/blob/master/drm-howto/modeset-vsync.c)
    from David Rheinsberg.

[^3]: [drm_doc](https://github.com/ascent12/drm_doc) by ascent12.
