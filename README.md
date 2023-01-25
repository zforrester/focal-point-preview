# Focal Point Preview

Quickly test and adjust the focal point and CSS background position for images

https://labs.zachforrester.me/focal-point

## Usage

### Choose an Image
Either choose an image using the button, or paste a URL in the text input. If you're running this localy, you can add the image to the /public/images folder and enter the filename and extension into the text input

### Specify coordinates
Adjust the inputs for the x and y coordinates until the two lines intersect at your desired focal point. If you resize the image, your focal point should remain visible.

You can use the up and down arrow keys to adjust the inputs by increments of 1, and hold shift to adjust by increments of 10.

You can use `px`, `em`, `vh`, or `vm` units, but percentages are recommended for best results

### Define background-size
To fill the available area, use `cover` (the default), but you can also try `contain` if you want to keep all of the image visible. You can pass any valid background-size value.

## Running Locally

### Setup

The Preview page runs on Vue 3/Vite.

Install dependencies
`npm i`

Run the server
`npm run dev`

### Using in Your SCSS Project
If you'd like similar functionality in your project, i've written a gist with 2 SCSS mixins.

https://gist.github.com/zforrester/9c12892561975daaa7c18e7b672b0796

`@mixin bg()`
For quickly defining the position, size, and focal point of a background image, with sensible defaults.

`@mixin show-focal-point-guides()`
Can be used from `bg()` or independently. Takes the x and y coordinates to draw bright red crosshairs using pseudo elements to help you define the images focal point

For example
```
.image {
    background-image: url('../yourimage.jpg');
    @include bg(cover, 40%, 65%, true))
}
```
