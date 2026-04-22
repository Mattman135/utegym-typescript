# Det här är min egna directory blueprint som använder shipfast och typescript

## Lathund

```
    git clone https://github.com/Mattman135/hundrastg-rdar-typescript [YOUR_APP_NAME]
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
- Ändra namnet på databasen i hero.
- Ändra HundrastgardarItem i CardComponent.tsx så att det passar
- 