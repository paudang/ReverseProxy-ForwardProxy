# Forward Proxy vs Reverse Proxy Demo

This project demonstrates the concepts of **Forward Proxy** and **Reverse Proxy** using Node.js.

## Concepts Explained

To understand the difference, it's helpful to look at **who the proxy represents**.

### 1. Forward Proxy
A **Forward Proxy** represents the **Client**. It sits in front of one or more clients and acts as an intermediary for requests to the internet.

*   **Who connects to it?** The Client (e.g., your browser, `curl`).
*   **Who does it connect to?** The Internet / External Servers.
*   **Purpose:**
    *   **Anonymity:** Hiding the client's IP address.
    *   **Content Filtering:** Blocking access to certain sites (common in corporate/school networks).
    *   **Caching:** Saving bandwidth by caching frequently accessed external resources.

**Visualizing Forward Proxy:**

```mermaid
graph LR
    subgraph Local Network
    Client[Client (User)] --> FP[Forward Proxy]
    end
    FP --> Internet
    Internet --> ServerA[Server A]
    Internet --> ServerB[Server B]
    
    style FP fill:#f9f,stroke:#333,stroke-width:2px
```

### 2. Reverse Proxy
A **Reverse Proxy** represents the **Server**. It sits in front of one or more web servers and acts as a gateway for requests coming *from* the internet.

*   **Who connects to it?** The Client (from the Internet).
*   **Who does it connect to?** Internal Backend Servers.
*   **Purpose:**
    *   **Load Balancing:** Distributing traffic across multiple server instances.
    *   **Security:** Hiding the IP and existence of backend servers.
    *   **SSL Termination:** Handling HTTPS encryption so backends don't have to.
    *   **Caching:** Caching content from the backend to serve faster to clients.

**Visualizing Reverse Proxy:**

```mermaid
graph LR
    Client[Client (User)] --> Internet
    Internet --> RP[Reverse Proxy]
    
    subgraph Internal Network
    RP --> Backend1[Backend Server 1]
    RP --> Backend2[Backend Server 2]
    end
    
    style RP fill:#f9f,stroke:#333,stroke-width:2px
```

---

## 3. Key Differences Table

| Feature | Forward Proxy | Reverse Proxy |
| :--- | :--- | :--- |
| **Sits in front of...** | Clients | Servers |
| **Protects/Hides...** | The Client | The Server |
| **Client Interaction** | Client *knows* about the proxy (usually configured). | Client *doesn't know* it's hitting a proxy (looks like a real server). |
| **Primary Goal** | Access control, Anonymity, outbound monitoring. | Load balancing, Security, High Availability. |

---

## How to Run the Demos

### Prerequisites
- Node.js installed.

### 1. Forward Proxy Demo
This demo runs a local proxy server. You will configure `curl` to use it to access a website.

1.  Navigate to `forward-proxy/`.
2.  Run `node server.js`.
3.  In another terminal, run:
    ```bash
    curl -x http://localhost:8080 http://example.com
    ```
    You will see logs in the proxy server knowing it forwarded your request.

### 2. Reverse Proxy Demo
This demo simulates a load balancer distributing requests to two backend servers.

1.  Navigate to `reverse-proxy/`.
2.  Run `node backend-server.js` (This spawns two backend processes on ports 3001 and 3002).
3.  Run `node proxy-server.js` (This runs the reverse proxy on port 3000).
4.  Open `http://localhost:3000` in your browser or use `curl`:
    ```bash
    curl http://localhost:3000
    ```
    Repeat the request. You should see the response alternate between "Backend 1" and "Backend 2".
