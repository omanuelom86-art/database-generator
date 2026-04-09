import time
import csv
import sys
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager

def scrape_yellow_pages(category, province="Heredia"):
    print(f"[*] Iniciando recolector para: {category} en {province}")
    
    # Chrome configuration
    chrome_options = Options()
    chrome_options.add_argument("--headless") # Run without UI for speed
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    results = []
    
    try:
        # Construct search URL (example logic for Yellow Pages CR)
        search_url = f"https://www.paginasamarillas.com.cr/servicios/{category.replace(' ', '-')}"
        driver.get(search_url)
        time.sleep(3)
        
        # Locate business entries (Selectors may need adjustment based on live site)
        entries = driver.find_elements(By.CLASS_NAME, "business-card")
        
        for entry in entries[:20]: # Limit for demo
            try:
                name = entry.find_element(By.TAG_NAME, "h2").text
                phone = entry.find_element(By.CLASS_NAME, "phone").text
                results.append({
                    "Empresa": name,
                    "Telefono": phone,
                    "Categoria": category.upper(),
                    "Provincia": province,
                    "Fuente": "Paginas Amarillas CR"
                })
                print(f"[+] Hallado: {name}")
            except:
                continue
                
    except Exception as e:
        print(f"[!] Error: {str(e)}")
    finally:
        driver.quit()
        
    # Save to CSV in the project
    with open('extracted_leads.csv', mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=["Empresa", "Telefono", "Categoria", "Provincia", "Fuente"])
        writer.writeheader()
        writer.writerows(results)
        
    print(f"[DONE] Se han guardado {len(results)} registros en leads_extraidos.csv")

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else "Abogados"
    scrape_yellow_pages(query)
