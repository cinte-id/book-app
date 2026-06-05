#!/usr/bin/env python3
"""
Backend Setup Script for Book Tracker App
Helps set up environment configuration files
"""

import os
import shutil

def setup_environment():
    """Set up environment configuration based on user choice"""
    
    print("🚀 Book Tracker Backend Setup")
    print("="*40)
    
    env_choice = input("Choose environment (development/production) [development]: ").strip().lower()
    if not env_choice:
        env_choice = "development"
    
    if env_choice not in ["development", "production"]:
        print("❌ Invalid choice. Using development.")
        env_choice = "development"
    
    source_file = f"env.{env_choice}"
    target_file = ".env"
    
    if os.path.exists(source_file):
        if os.path.exists(target_file):
            overwrite = input("⚠️  .env file already exists. Overwrite? (y/N): ").strip().lower()
            if overwrite != 'y':
                print("❌ Setup cancelled.")
                return
        
        shutil.copy(source_file, target_file)
        print(f"✅ Environment configured for {env_choice}")
        print(f"📄 Copied {source_file} to {target_file}")
        
        if env_choice == "production":
            print("\n⚠️  IMPORTANT:")
            print("   - Update SECRET_KEY in .env file")
            print("   - Update DATABASE_URL in .env file")
            print("   - Update CORS_ORIGINS in .env file")
        
        print("\n🎯 Next steps:")
        print("   1. Review and edit .env file if needed")
        print("   2. Install dependencies: pip install -r requirements.txt")
        print("   3. Run the app: python app.py")
        
    else:
        print(f"❌ Environment file {source_file} not found!")

if __name__ == "__main__":
    setup_environment() 