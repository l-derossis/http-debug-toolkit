param(
    [switch]$SkipSpaBuild,
    [switch]$Push,
    [switch]$Run,
    [string]$Tag="development"
)

$image = "lderossis/hdt:" + $Tag

cd ..

if(!$SkipSpaBuild) {
    Write-Output("Start building SPA")
    cd RequestLoggerSpa\request-logger
    npm install
    ng build --prod
    cd ../..
}

Write-Output("Copying Angular dist in wwwroot")
Copy-item -Force -Recurse .\RequestLoggerSpa\request-logger\dist\request-logger\* -Destination .\RequestLoggerApi\RequestLogger\wwwroot

Write-Output("Start publishing API")
dotnet publish -c Release .\RequestLoggerApi\RequestLogger\

Write-Output("Build Docker image")
docker build -t $image .\RequestLoggerApi\RequestLogger

if($Push) {
    Write-Output("Pushing Docker image")
    docker push $image
}

if($Run) {
    docker run -p 80:80 $image
}

cd .\Scripts