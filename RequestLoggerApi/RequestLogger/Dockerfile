FROM mcr.microsoft.com/dotnet/aspnet:5.0

COPY bin/Release/net5.0/publish/ /app
WORKDIR /app
EXPOSE 80 
EXPOSE 443
EXPOSE 5000
EXPOSE 5001
ENTRYPOINT ["dotnet", "RequestLogger.dll"]