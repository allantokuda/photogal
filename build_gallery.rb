#!/usr/bin/env ruby

gallery_paths = Dir.glob 'galleries/*'

CSS = <<-CSS
<style>
  body {
    background: #333;
  }
</style>
CSS

gallery_paths.each do |gallery_path|
  index_path = File.join gallery_path, 'index.html'
  image_paths = Dir.glob(File.join(gallery_path, '**/*.jpg'))
  tags = image_paths.map { |p| File.basename p }.map do |path|
    <<-HTML
      <a href=#{path}>
        <img src="#{path}" height=200>
      </a>
    HTML
  end

  File.write(index_path, CSS)
  File.write(index_path, tags.join("\n"), mode: 'a')
end
