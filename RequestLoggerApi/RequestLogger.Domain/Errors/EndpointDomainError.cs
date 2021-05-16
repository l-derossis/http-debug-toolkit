﻿namespace RequestLogger.Domain.Errors
{
    public class EndpointDomainError : DomainError
    {
        public readonly string Route;

        public readonly string Method;

        public EndpointDomainError(string route, string method, string message) : base(message)
        {
            Route = route;

            Method = method;
        }
    }
}
