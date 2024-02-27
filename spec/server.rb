require 'sinatra'
get '/' do
  erb :index
end

post '/upload' do
  file = params[:fileUpload]

  if file
    fileName = file[:filename]
    uploadPath = File.join(Dir.pwd, fileName)

    begin
      File.open(uploadPath, "wb") do |f|
        f.write(file[:tempfile].read)
      end
      "File uploaded successfully!"
    rescue
      "Failed to save the uploaded file."
    end
  else
    "No file uploaded."
  end
end