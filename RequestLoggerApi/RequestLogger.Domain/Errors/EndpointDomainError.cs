namespace RequestLogger.Domain.Errors
{
    public class EndpointDomainError : DomainError
    {
        public string Route { get; }

        public string Method { get; }

        public EndpointDomainError(string route, string method, string message) : base(message)
        {
            Route = route;

            Method = method;
        }
    }
}
