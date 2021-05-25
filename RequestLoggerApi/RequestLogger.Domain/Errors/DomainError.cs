namespace RequestLogger.Domain.Errors
{
    public class DomainError
    {
        public string Message { get; }

        public DomainError(string message)
        {
            Message = message;
        }
    }
}
