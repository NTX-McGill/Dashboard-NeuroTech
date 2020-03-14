import pickle
import numpy as np
from scipy import zeros, signal, random

def butter_filter(windows, fs=250, order=2, low=20, high=120, notch=True):
    result = []
    nyq = fs / 2
    b, a = signal.butter(order, [low/nyq, high/nyq], 'bandpass')
    z_butter = signal.lfilter_zi(b, a)
    for i, w in enumerate(windows):
        if i == 0 and notch:
            w, z_notch = notch_filter(w)
        elif notch:
            w, z_notch = notch_filter(w, z=z_notch)
        
        w, z_butter = signal.lfilter(b, a, w, zi=z_butter)
        result.append(w)
    
    return result

def notch_filter(arr, fs=250, z=[]):
    freqs = np.array([60.0])
    nyq = fs / 2
    for f in np.nditer(freqs):
        bp_stop_f = f + 3.0 * np.array([-1,1])
        b, a = signal.butter(3, bp_stop_f / nyq, 'bandstop')

        if len(z) == 0:
            z = signal.lfilter_zi(b, a)

    return signal.lfilter(b, a, arr, zi=z)

def test_filter(windows, fs=250, order=2, low=20, high=120):
    result = []
    nyq = fs / 2
    bb, ba = signal.butter(order, [low/nyq, high/nyq], 'bandpass')
    bz = signal.lfilter_zi(bb, ba)

    notch_freq = 60.0
    bp_stop = notch_freq + 3.0 * np.array([-1,1])
    nb, na = signal.iirnotch(notch_freq, notch_freq / 6, fs)
    nz = signal.lfilter_zi(nb, na)

    for w in windows:
        w, nz = signal.lfilter(nb, na, w, zi=nz)
        w, bz = signal.lfilter(bb, ba, w, zi=bz)
        result.append(w)
    
    return result



