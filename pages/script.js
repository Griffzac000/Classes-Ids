const supabaseUrl = "https://bzvxnuuqiquzfkiibcli.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6dnhudXVxaXF1emZraWliY2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5Njk4MjQsImV4cCI6MjA5MzU0NTgyNH0.ePYuz6zHyoDT45CaD5TVJJJY62M08lu3d3htOzEg1PI";
const db = supabase.createClient(supabaseUrl, supabaseKey);


const siteName = "Fashion Gallery"; // string
let selectedStyle = ""; // string
const maxItems = 5; // number
let isFiltered = false; // boolean


const styles = [
    { name: "Streetwear", category: "casual" },
    { name: "Classic", category: "formal" },
    { name: "Grunge", category: "casual" },
    { name: "Formal", category: "formal" },
    { name: "Casual", category: "casual" }
];


const galleryItems = document.querySelectorAll(".gallery-item");
const title = document.querySelector(".site-title");

const guestbookList = document.getElementById("guestbook-list");
const form = document.getElementById("guestbook-form");
const loadingText = document.getElementById("loading");


function updateTitle(text) {
    if (title) {
        title.textContent = text;
    }
}


function highlightItems(category) {
    galleryItems.forEach((item, index) => {
        const style = styles[index];

        if (style && style.category === category) {
            item.style.border = "3px solid deepskyblue";
        } else {
            item.style.border = "none";
        }
    });
}


function resetItems() {
    galleryItems.forEach(item => {
        item.style.border = "none";
    });
}


if (title) {
    title.addEventListener("click", () => {
        selectedStyle = "casual";
        isFiltered = true;
        updateTitle("Showing Casual Styles");
        highlightItems("casual");
    });

    title.addEventListener("dblclick", () => {
        isFiltered = false;
        updateTitle(siteName);
        resetItems();
    });
}

galleryItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
        item.style.backgroundColor = "#444";
    });

    item.addEventListener("mouseleave", () => {
        item.style.backgroundColor = "";
    });
});


async function loadMessages() {
    if (!guestbookList || !loadingText || !db) return;

    loadingText.style.display = "block";

    try {
        const { data, error } = await db
            .from("guestbook")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        guestbookList.innerHTML = "";

        if (!data || data.length === 0) {
            guestbookList.textContent = "No messages yet.";
            return;
        }

        data.forEach(entry => {
            const div = document.createElement("div");

            div.innerHTML = `
                <strong>${entry.name}</strong> (${entry.category}): ${entry.message}
                <button type="button" data-id="${entry.id}" class="delete-btn">Delete</button>
            `;

            guestbookList.appendChild(div);
        });

    } catch (err) {
        console.error("Error loading:", err);
        guestbookList.textContent = "Failed to load messages.";
    } finally {
        loadingText.style.display = "none";
    }
}


async function addMessage(name, message, category) {
    if (!db) return;

    try {
        const { error } = await db
            .from("guestbook")
            .insert([{ name, message, category }]);

        if (error) throw error;

        await loadMessages();

    } catch (err) {
        console.error("Insert error:", err);
        alert("Failed to submit message.");
    }
}


async function deleteMessage(id) {
    if (!db) return;

    try {
        const { error } = await db
            .from("guestbook")
            .delete()
            .eq("id", id);

        if (error) throw error;

        await loadMessages();

    } catch (err) {
        console.error("Delete error:", err);
    }
}


if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("nameInput").value.trim();
        const message = document.getElementById("messageInput").value.trim();
        const category = document.getElementById("categoryInput").value;

        await addMessage(name, message, category);
        form.reset();
    });
}


if (guestbookList) {
    guestbookList.addEventListener("click", (e) => {
        const button = e.target.closest(".delete-btn");
        if (button) {
            deleteMessage(button.dataset.id);
        }
    });
}


if (guestbookList && loadingText) {
    loadMessages();
}