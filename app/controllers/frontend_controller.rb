##
# Controller to serve static files from the public directory for the frontend.
#
# This is used to serve the frontend application built with Vite, which outputs static files to the public directory.
# The routes for this controller are dynamically generated in config/routes/frontend.rb, which searches for all
# index.html files in the public directory and creates a route for each one that serves the file through this controller.
class FrontendController < ApplicationController
  STATIC_FILES_PATH = Rails.root.join("public").realpath.freeze
  STATIC_FILES_PREFIX = "#{STATIC_FILES_PATH}/".freeze

  def index
    send_file file_path, type: "text/html", disposition: "inline"
  end

  private

  def file_path
    path = Pathname.new(params.require(:file_path)).cleanpath
    raise ActionController::RoutingError, "Not Found" unless path.basename.to_s == "index.html"

    expanded_path = path.realpath

    unless expanded_path.to_s.start_with?(STATIC_FILES_PREFIX)
      raise ActionController::RoutingError, "Not Found"
    end

    raise ActionController::RoutingError, "Not Found" unless expanded_path.file?

    expanded_path
  rescue Errno::ENOENT
    raise ActionController::RoutingError, "Not Found"
  end
end
