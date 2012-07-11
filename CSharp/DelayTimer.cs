using System;
using System.Windows.Threading;

namespace adamsteinert
{
    /// <summary>
    /// A simple class to encapsulate the functionality for a restartable timer.  When Restart is called the timer is stopped
    /// so the time interval starts again from that point.  For when ReactiveExtensions aren't available ;)
    /// </summary>
    public class DelayTimer
    {
        DispatcherTimer _timer;
        Action _tickAction;

        #region -- Events ---

        public event EventHandler Tick;

        void _timer_Tick(object sender, EventArgs e)
        {
            _timer.Stop();

            if (Tick != null)
                Tick(sender, e);

            if (_tickAction != null)
                _tickAction();
        }

        #endregion

        #region -- Construction --

        public DelayTimer(int milliseconds)
        {
            _timer = new DispatcherTimer()
            {
                Interval = new TimeSpan(0, 0, 0, 0, milliseconds),
                IsEnabled = false
            };

            _timer.Tick += new EventHandler(_timer_Tick);
        }

        #endregion

        /// <summary>
        /// Restart the timer.
        /// </summary>
        /// <param name="complete">Optional action to perform when the delay timer fires.  Tick event still fires</param>
        public void Restart(Action completeAction = null)
        {
            _tickAction = completeAction;
            _timer.Stop();
            _timer.Start();
        }

        /// <summary>
        /// Stops the timer and clears the tick action.
        /// </summary>
        public void Reset()
        {
            //_tickAction = null;
            _timer.Stop();
        }

        public bool IsEnabled
        {
            get
            {
                return _timer != null && _timer.IsEnabled;
            }
        }
    }
}