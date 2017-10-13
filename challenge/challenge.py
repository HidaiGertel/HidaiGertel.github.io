import sys
import numpy as np
from datetime import datetime, timedelta
from scipy.stats import norm

def main():
  
  #   floor_time: keeps the relevant (current) 15 min. interval stamp.
  #   time: keeps the last time stamp read from file.
  #   new_time: the new time stamp read from file.

  floor_time = None
  walking_dur = [timedelta(minutes=0)]
  walk_flag = 0
  qh = timedelta(minutes=15) # quarter-hour
  for line in sys.stdin:
    stamp = line.split("\t")
    new_time = datetime.strptime(stamp[0], "%Y-%m-%dT%H:%M:%S.%f+00:00")
    if floor_time is None:
      floor_time = new_time.replace(minute = (new_time.minute/15)*15)
    if walk_flag:
        walking_dur[-1] = walking_dur[-1] + (new_time-time)
    walk_flag = int(stamp[2])
    time = new_time
    
    # restart counting every 15 min.
    if time-floor_time >= qh:
        floor_time = floor_time + qh
        walking_dur.append(timedelta(minutes=0))
        
  walk_array = np.array([i.total_seconds() for i in walking_dur])
  temp = np.cumsum(walk_array)
  x = temp[(60/15)*48:]-temp[:-(60/15)*48]
  
  # define prediction model
  p = np.poly1d([ -6.83054022e-30,   6.49676089e-25,  -2.61731595e-20,
         5.81266936e-16,  -7.75534185e-12,   6.34379895e-08,
        -3.09768648e-04,   8.23645676e-01,  -8.99607013e+02])
  
  # assume errors are normally distributed
  y = p(x[-1])
  e_std = 0.806971545855 # as observed in training
  sys.stdout.write(str(norm.ppf(12.5-y, loc=0, scale=e_std)*100)+' %\n')
  

if __name__ == '__main__':
  main()
