#!/usr/bin/env ruby

require 'yaml'

gallery_paths = Dir.glob 'galleries/*'

def load_template(template_file_name, substitutions)
  template = File.read(template_file_name)
  substitutions.each do |key, val|
    template.gsub!(key.to_s, val)
  end
  template
end

def gallery_title(path)
  File.basename(path).gsub(/[-_]/, ' ')
end


# Index per gallery
gallery_paths.each do |gallery_path|
  gallery_index_path = File.join gallery_path, 'index.html'
  image_paths = Dir.glob(File.join(gallery_path, '*.{jpg,JPG,png,PNG,gif,GIF}'))
  image_tags = image_paths.map { |p| File.basename p }.map do |path|
    <<-HTML
      <a class="thumbLink" href="##{path}">
        <img class="thumbnail" src="thumbs/#{path}">
      </a>
    HTML
  end

  thumb_dir = File.join gallery_path, 'thumbs'
  `mkdir -p #{thumb_dir}`
  image_paths.each do |path|
    # ImageMagick resize to thumbnail height
    thumb_path = File.join(thumb_dir, File.basename(path))
    puts `convert -verbose #{path} -geometry x200 #{thumb_path}` unless File.exist? thumb_path
  end

  File.write(gallery_index_path, load_template('gallery_template.html', { MAIN_CONTENT: image_tags.join("\n"), TITLE: gallery_title(gallery_path) }))

  %w(style.css gallery.js).each do |file|
    symlink_path = File.join gallery_path, file
    `ln -s ../../#{file} #{symlink_path}` unless File.exist? symlink_path
  end
end


# Site index (All galleries)
gallery_tags = gallery_paths.map do |gallery_path|
  config_file = File.join gallery_path, 'config.yml'
  config = (YAML.load(File.read(config_file)) if File.exist? config_file) || {}

  next if config['unlisted'] == true

  gallery_thumb_path = if config['key']
    File.join(gallery_path, 'thumbs', config['key'])
  else
    Dir.glob(File.join(gallery_path, 'thumbs', '*')).first
  end

  <<-HTML
    <a class="galleryLink" href="#{File.join gallery_path, 'index.html'}">
      <img src="#{gallery_thumb_path}">
      <h3>#{gallery_title(gallery_path)}</h3>
    </a>
  HTML
end
File.write('index.html', load_template('index_template.html', { MAIN_CONTENT: gallery_tags.join("\n") }))
