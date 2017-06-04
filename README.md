# PhotoGal
PhotoGal generates a beautiful photo gallery from a plain directory of files.

It provides the features casual visitors will notice:
* Thumbnails
* Sharp modern appearance
* Easy navigation controls

![PhotoGal screenshot](http://www.allantokuda.com/files/photogal_screenshot.png)

It does NOT provide:
* Photo editing - you will need to export into this from other software like Lightroom or Darktable.
* Comments/likes/social media integration
* Uploading photos to a server -- you will need to move the files yourself with utilities like SFTP or `rsync`.
* Tagging and categorizing photos across galleries -- you can only have a simple list of galleries.
* Rearranging photos to appear in a particular order -- you will need to rename the files to do this.

# Dependencies

This requires Ruby and ImageMagick.

```
# Ubuntu Linux
sudo apt install ruby imagemagick

# Mac OSX (with Homebrew)
brew install ruby imagemagick
```

# Setup
```
git clone https://github.com/allantokuda/photogal.git photos
cd photos/galleries
```

Put your photos into subfolders of the "galleries" folder, so your files look like
```
galleries/Example-Gallery-1/DSC_1234.jpg
```

Then run this script, which creates generates thumbnails and and creates the `index.html` files for each gallery:
```
./build_gallery.rb
```

# Gallery configuration

Each gallery can have a `config.yml` file, e.g. `galleries/Example-Gallery/config.yml`. Examples:

Set a key image to represent the gallery on the site index:
```
key: DSC_4567.jpg
```

Make the gallery unlisted on the site index:
```
unlisted: true
```
