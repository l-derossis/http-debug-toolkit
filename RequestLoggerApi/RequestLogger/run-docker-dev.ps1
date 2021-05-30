docker run -p 80:80 `
	-w /app -v "${pwd}/bin/Release/net5.0/publish/:/app" `
	mcr.microsoft.com/dotnet/aspnet:5.0 `
	dotnet RequestLogger.dll