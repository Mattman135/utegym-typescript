# Det här är min egna directory blueprint som använder shipfast och typescript

## Lathund

```
    git clone https://github.com/Mattman135/dirTS-blueprint [YOUR_APP_NAME]
    cd [YOUR_APP_NAME]
    git checkout supabase
    npm install
    git remote remove origin
    npm run dev
```

- Skapa en .env.local file och kopiera environment variabler
```
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    SUPABASE_SERVICE_ROLE_KEY=
    RESEND_API_KEY=
    STRIPE_PUBLIC_KEY=
    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=
```

- Skapa supabase konto och ändra environment variabler (env.local) till rätt projekt
- Lägg till SELECT RLS policy
- Ändra namnet på databasen i hero data_table_name
- Byt icon.png och favicon.ico i app folder
- Ändra public/DogParkIcon.jpg till en passande bild
- Konfigurera config.js
- Ändra FAQ sektion
