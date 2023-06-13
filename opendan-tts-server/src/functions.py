import time
import json

def get_time_utc(zone ,delay=0):
    loc_time = time.gmtime(time.time() + delay + zone * 60 * 60)
    return time.strftime("%Y-%m-%d %H:%M:%S",loc_time)

def clear_dict(d):
    if d is None:
        return None
    elif isinstance(d, list):
        return list(filter(lambda x: x is not None, map(clear_dict, d)))
    elif not isinstance(d, dict):
        return d
    else:
        r = dict(
                filter(lambda x: x[1] is not None,
                    map(lambda x: (x[0], clear_dict(x[1])),
                        d.items())))
        if not bool(r):
            return None
        return r

def print_env(server_port=6006, sleep=3):
    print("")
    print("")
    print("###########################################")
    print("environment variable start-----------------------------------")
    print("###########################################")
    print("")

    print("server_port: " + str(server_port))

    print("")
    print("###########################################")
    print("Please check the environment variables (the program will start in 3 seconds) ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑")
    print("###########################################")
    print("")
    print("")
    time.sleep(sleep)
    return

def print_log(request, respose, time_start=0):
    print("______________________________________________")
    print("request" + ":::\n" + json.dumps(clear_dict(request.__dict__))) # class dict convert to json
    print("respose" + ":::")
    if isinstance(respose, dict) or isinstance(respose,list):
        print(respose)
    else:
        print(respose.__dict__)
    print("cost:::\n" + str(time.time() - time_start) + "s")
    print("finish:::\n" + get_time_utc(-8))
    return