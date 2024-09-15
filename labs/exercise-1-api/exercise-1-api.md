- [1. API-Anbindung](#1-api-anbindung)
  - [1.1 Axios in Login.tsx einbinden](#11-axios-in-logintsx-einbinden)
  - [1.2 Axios in Register.tsx einbinden](#12-axios-in-registertsx-einbinden)

The solution branch for the whole lab is `solution-1-api`

# 1. API-Anbindung

Wir verwenden in dem Schulungsprojekt json-server mit der Middleware json-server-auth. json-server wird mit Hilfe des NPM-Pakets concurrently parallel zur React App gestartet.

## 1.1 Axios in Login.tsx einbinden

Rufen Sie mit Hilfe von axios.post in der Methode `handleSubmit` die API <http://localhost:3001/login> auf. Übergeben Sie in dem Body den State `formData`.

<details>
<summary>Show Solution</summary>
<p>

**/src/components/login/Login.tsx**

```typescript
import axios from "axios";

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    
    // Aufgabe: Übermitteln Sie die Daten an den JSON-Server http://localhost:3001/login
    const response = await axios.post("http://localhost:3001/login", formData);
    console.log(response.data);

    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    
};
```

</p>
</details>

## 1.2 Axios in Register.tsx einbinden

Rufen Sie mit Hilfe von axios.post in der Methode `handleSubmit` die API <http://localhost:3001/register> auf. Übergeben Sie in dem Body den State `formData`.

<details>
<summary>Show Solution</summary>
<p>

**/src/components/**

```typescript
import axios from "axios";

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    
    // Aufgabe: Übermitteln Sie die Daten an den JSON-Server http://localhost:3001/login
    const response = await axios.post("http://localhost:3001/register", formData);
    console.log(response.data);

    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    
};
```

</p>
</details>

## 1.3 Axios in Products.tsx einbinden

Rufen Sie mit axios.get in der Products.tsx nach dem Laden alle Produkte von <http://localhost:3001/products>. Nutzen Sie hierzu den useEffect-Hook. Das Ergebnis soll in dem products-State gespeichert werden.

<details>
<summary>Show Solution</summary>
<p>

**/src/components/**

```typescript
useEffect(() => {
    const fetchProducts = async () => {
        const response = await axios.get<Product[]>("http://localhost:3001/products");
        setProducts(response.data);
    };

    fetchProducts();

}, []);
```

</p>
</details>