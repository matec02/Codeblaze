from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

chrome_driver_path = 'C:/Users/karla/Desktop/chromedriver-win64/chromedriver'

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument(f"webdriver.chrome.driver={chrome_driver_path}")

driver = webdriver.Chrome(options=chrome_options)

try:
    print("Navigating to the login page...")
    driver.get('http://localhost:3000/login')  
    
    username_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, 'email'))
    )

    print("Performing login...")
    username_input = driver.find_element(By.ID, 'email')  
    password_input = driver.find_element(By.ID, 'password')  
    login_button = driver.find_element(By.CLASS_NAME, 'login-form-button')  

    username_input.send_keys('admin@gmail.com')
    password_input.send_keys('admin')
    login_button.click()

    
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.CLASS_NAME, 'navbar-account')))
    
    
    assert 'Codeblaze' in driver.title
    print("Assertion successful: 'Codeblaze' is in the title.")
    

finally:
    print("Quitting the WebDriver...")
    driver.quit()
