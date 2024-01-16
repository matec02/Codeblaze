from selenium import webdriver
import os
import time
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

chrome_driver_path = 'C:/Users/karla/Desktop/chromedriver-win64/chromedriver'
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument(f"webdriver.chrome.driver={chrome_driver_path}")
driver = webdriver.Chrome(options=chrome_options)

try:
    
    driver.get('http://localhost:3000/register')  
    
    ime_input = driver.find_element(By.XPATH, f'//label[text()="{"Ime:"}"]/following-sibling::input') 
    prezime_input = driver.find_element(By.XPATH, f'//label[text()="{"Prezime:"}"]/following-sibling::input') 
    nadimak_input = driver.find_element(By.XPATH, f'//label[text()="{"Nadimak:"}"]/following-sibling::input')
    email_input = driver.find_element(By.XPATH, f'//label[text()="{"Email:"}"]/following-sibling::input')
    kazna_input = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//input[@type="file"]')))
    dokument_input = driver.find_element(By.XPATH, f'//label[text()="{"Dokument Identifikacije:"}"]/following-sibling::input')
    phone_input = driver.find_element(By.CLASS_NAME, "PhoneInput")
    card_input = driver.find_element(By.XPATH, f'//label[text()="{"Broj kartice:"}"]/following-sibling::input')
    password_input = driver.find_element(By.XPATH, '//input[@type="password" and @placeholder="Upišite lozinku"]') 
    confirm_password_input = driver.find_element(By.XPATH, '//input[@type="password" and @placeholder="Upišite ponovno istu lozinku"]')  
    register_button = driver.find_element(By.XPATH, '//button[@type="submit" and @class="register-form-button"]')  

    ime_input.send_keys('New')
    prezime_input.send_keys('User')
    nadimak_input.send_keys("usernew")
    email_input.send_keys("new_user@example.com")
    file_path = 'slika.jpg'
    kazna_input.send_keys(file_path)
    dokument_input.send_keys(file_path)
    card_input.send_keys("123412341234")
    password_input.send_keys('password123')
    confirm_password_input.send_keys('password123')
    
    print("Filled out the form.")
    
    register_button.click()
    
    print("Pressed Register.")
    
    time.sleep(2)

    current = driver.current_url
    if (current != 'http://localhost:3000/home'):
        print("You must type phone number")
    

finally:
    
    driver.quit()
