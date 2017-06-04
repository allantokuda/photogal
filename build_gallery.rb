#!/usr/bin/env ruby

gallery_paths = Dir.glob 'galleries/*'

def load_template(template_file_name, main_content)
  File.read(template_file_name).gsub('MAIN_CONTENT', main_content)
end


# Index per gallery
gallery_paths.each do |gallery_path|
  gallery_index_path = File.join gallery_path, 'index.html'
  image_paths = Dir.glob(File.join(gallery_path, '*.jpg'))
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

  File.write(gallery_index_path, load_template('gallery_template.html', image_tags.join("\n")))

  %w(style.css gallery.js).each do |file|
    symlink_path = File.join gallery_path, file
    `ln -s ../../#{file} #{symlink_path}` unless File.exist? symlink_path
  end
end


# Site index (All galleries)
gallery_tags = gallery_paths.map do |gallery_path|
  gallery_thumb_path = Dir.glob(File.join(gallery_path, 'thumbs', '*')).first
  <<-HTML
    <a class="galleryLink" href="#{File.join gallery_path, 'index.html'}">
      <img src="#{gallery_thumb_path}">
      <h3>#{File.basename(gallery_path).capitalize}</h3>
    </a>
  HTML
end
File.write('index.html', load_template('index_template.html', gallery_tags.join("\n")))
