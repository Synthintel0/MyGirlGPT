## How to Test Your SDWebUI

1. Replace `YOUR_SD_ADDRESS` with your SDWebUI address in the `test_sd.py` file by following these steps:

    a. Open your code editor.

    b. Locate the part of the code where `YOUR_SD_ADDRESS` is mentioned. It might look something like this:

    ```python
    sd_address = "YOUR_SD_ADDRESS"
    ```

    c. Replace `YOUR_SD_ADDRESS` with your SDWebUI address. For example:

    ```python
    sd_address = "http://xxx.xxx.xxx:xxx"
    ```

    d. Save the changes in the code file.

2. Run the command `python test_sd.py` in your terminal to check if the SDWebUI address you provided is valid.

    - If the address is correct, you will receive an image in the current directory.
    - If the address is incorrect, you can check the console output for error messages.

Make sure you have the necessary dependencies installed and a working internet connection to successfully test your SDWebUI.