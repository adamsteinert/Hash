namespace adamsteinert
{    
	/// <summary>
    /// Sends notifications that an operation is or is not busy.
    /// </summary>
    public class AutoBusyHandler : IDisposable
    {
        protected BusyCategoryToken _token;

        public AutoBusyHandler(BusyCategoryToken token = null)
        {
            _token = token;
            SendBusyNotification(true);
        }

        public void Dispose()
        {
            SendBusyNotification(false);
        }

        private void SendBusyNotification(bool isBusy)
        {
            if(_token == null)
                Messenger.Default.Send(new BusyIndicatorMessage(isBusy));
            else
                Messenger.Default.Send(new BusyIndicatorMessage(isBusy), _token);
        }
    }
	
	public class BusyCategoryToken
    {
        public static readonly BusyCategoryToken GlobalBusyToken = new BusyCategoryToken();
        public readonly static BusyCategoryToken DeviceSettingsToken = new BusyCategoryToken();
    }
	
	public class BusyIndicatorMessage : MessageBase
    {
        public bool IsBusy { get; set; }

        public BusyIndicatorMessage(bool isBusy)
        {
            IsBusy = isBusy;
        }
    }
	
	    public class BusyIndicatorViewModel : ViewModelBase
    {

        #region -- Properties --

        public const string IsBusyPropertyName = "IsBusy";
        private bool _isBusy = false;
        public bool IsBusy
        {
            get
            {
                return _isBusy;
            }

            set
            {
                if (_isBusy == value)
                {
                    return;
                }
                _isBusy = value;
                RaisePropertyChanged(IsBusyPropertyName);
            }
        }

        #endregion

        public BusyIndicatorViewModel(BusyCategoryToken busyToken)
        {
            Messenger.Default.Register<BusyIndicatorMessage>(this, busyToken,
                (message) =>
                {
                    ReferenceCountedBusyEnabler(message.IsBusy);
                });
        }

        private int _busyCount = 0;
        private object _sync = new object();
        private void ReferenceCountedBusyEnabler(bool isBusy)
        {
            lock (_sync)
            {
                _busyCount += (isBusy ? 1 : -1);
                if (_busyCount < 0)
                    _busyCount = 0;

                Task.Factory.StartNew(() => this.ReturnOnUIThread(() => IsBusy = _busyCount > 0));
                
            }
        }
		
		public interface IBusyIndicatorViewModel
		{
			void ReferenceCountedBusyEnabler(bool isBusy);
			bool IsBusy { get; set; }
		}
    }
}