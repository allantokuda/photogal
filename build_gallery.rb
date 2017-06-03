#!/usr/bin/env ruby

gallery_paths = Dir.glob 'galleries/*'

def render_template(main_content)
<<-TEMPLATE
<html>
<head>
<style>
#{File.read('style.css')}
</style>
<script>
#{File.read('gallery.js')}
</script>
</head>
<body>
<div class="fullview" style="display: none">
  <a href="#" class="prevImageLink"><span></span></a>
  <a href="#" class="nextImageLink"><span></span></a>
  <a href="#" class="closeImageLink"><span></span></a>
  <div class="container">
    <div class="image">
    </div>
    <img src="" width="100%" class="fullViewImage">
  </div>
</div>
<div class="thumbview">
#{main_content}
</div>
</body>
</html>
TEMPLATE
end

gallery_paths.each do |gallery_path|
  index_path = File.join gallery_path, 'index.html'
  image_paths = Dir.glob(File.join(gallery_path, '**/*.jpg'))
  tags = image_paths.map { |p| File.basename p }.map do |path|
    <<-HTML
      <a class="thumbLink" href="##{path}">
        <img src="#{path}" height=200>
      </a>
    HTML
  end

  File.write(index_path, render_template(tags.join("\n")))
end
