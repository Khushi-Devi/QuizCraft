import google.generativeai as genai

# PUT YOUR API KEY HERE
GEMINI_API_KEY = "AIzaSyDnoOyAacnxOUjl2oUtlexff3IQ2bkLO14"

genai.configure(api_key=GEMINI_API_KEY)

print("Available models that support generateContent:\n")
for model in genai.list_models():
    if "generateContent" in model.supported_generation_methods:
        print(f"  {model.name}")