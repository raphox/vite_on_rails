# This file searches for all static files in the public directory and creates a route for each one that serves the file through the FrontendController.
static_files_path = Rails.root.join("public").to_s
static_files = File.join(static_files_path, "**", "index.html")

Dir.glob(static_files).sort.each do |path|
  route = path[%r{#{Regexp.escape(static_files_path)}(.*)/index.html}, 1]
  route = "/" if route.blank?

  next if route == "/"

  get "#{route}/*path", to: "frontend#index", file_path: path, as: "frontend#{route.tr("/", "_")}"
end
