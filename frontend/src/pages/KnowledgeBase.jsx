import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./KnowledgeBase.css";

function KnowledgeBase() {
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
  });

  const [editingId, setEditingId] = useState(null);

  const loadKnowledge = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://127.0.0.1:8000/knowledge"
      );

      setKnowledge(response.data);
    } catch (requestError) {
      console.error(
        "Knowledge loading error:",
        requestError
      );

      setError(
        "Unable to load knowledge records. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKnowledge();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      category: "General",
    });

    setEditingId(null);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.question.trim() ||
      !formData.answer.trim() ||
      !formData.category.trim()
    ) {
      setError(
        "Please complete the question, answer and category fields."
      );
      return;
    }

    try {
      setError("");
      setMessage("");

      const payload = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        category: formData.category.trim(),
      };

      if (editingId !== null) {
        await axios.put(
          `http://127.0.0.1:8000/knowledge/${editingId}`,
          payload
        );

        setMessage(
          "Knowledge article updated successfully."
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/knowledge",
          payload
        );

        setMessage(
          "Knowledge article added successfully."
        );
      }

      setFormData({
        question: "",
        answer: "",
        category: "General",
      });

      setEditingId(null);
      await loadKnowledge();
    } catch (requestError) {
      console.error(
        "Knowledge save error:",
        requestError
      );

      setError(
        requestError.response?.data?.detail ||
          "Unable to save the knowledge article."
      );
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);

    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteKnowledge = async (itemId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this knowledge article?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await axios.delete(
        `http://127.0.0.1:8000/knowledge/${itemId}`
      );

      setMessage(
        "Knowledge article deleted successfully."
      );

      if (editingId === itemId) {
        resetForm();
      }

      await loadKnowledge();
    } catch (requestError) {
      console.error(
        "Knowledge delete error:",
        requestError
      );

      setError(
        requestError.response?.data?.detail ||
          "Unable to delete the knowledge article."
      );
    }
  };

  return (
    <div className="knowledge-page">
        <header className="knowledge-header">
        <div>
          <p className="knowledge-label">
            ADMINISTRATOR WORKSPACE
          </p>

          <h1>Knowledge Base Management</h1>

          <p className="knowledge-subtitle">
            Add, update and remove telecom support information.
          </p>
        </div>

        <div className="knowledge-header-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={loadKnowledge}
          >
            ↻ Refresh
          </button>

          <Link
            to="/admin"
            className="primary-link"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <section className="knowledge-form-card">
        <div className="section-heading">
          <div>
            <p className="section-label">
              {editingId !== null
                ? "EDIT ARTICLE"
                : "NEW ARTICLE"}
            </p>

            <h2>
              {editingId !== null
                ? "Update Knowledge Article"
                : "Add Knowledge Article"}
            </h2>
          </div>

          {editingId !== null && (
            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel Editing
            </button>
          )}
        </div>

        <form
          className="knowledge-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="question">
              Question
            </label>

            <input
              id="question"
              name="question"
              type="text"
              placeholder="Example: How can I reset my telecom password?"
              value={formData.question}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">
              Category
            </label>

            <input
              id="category"
              name="category"
              type="text"
              placeholder="Example: Account Support"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="answer">
              Answer
            </label>

            <textarea
              id="answer"
              name="answer"
              rows="7"
              placeholder="Enter the complete support answer..."
              value={formData.answer}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="save-button"
            >
              {editingId !== null
                ? "Update Article"
                : "Add Article"}
            </button>

            <button
              type="button"
              className="clear-button"
              onClick={resetForm}
            >
              Clear Form
            </button>
          </div>
        </form>
      </section>

      <section className="knowledge-table-card">
        <div className="section-heading">
          <div>
            <p className="section-label">
              DATABASE RECORDS
            </p>

            <h2>Knowledge Articles</h2>

            <p className="knowledge-subtitle">
              Live records loaded from the SQLite database.
            </p>
          </div>

          <span className="record-count">
            {knowledge.length} records
          </span>
        </div>

        {loading ? (
          <p className="table-status">
            Loading knowledge records...
          </p>
        ) : knowledge.length === 0 ? (
            <p className="table-status">
            No knowledge articles were found.
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="knowledge-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {knowledge.map((item) => (
                  <tr key={item.id}>
                    <td className="id-cell">
                      {item.id}
                    </td>

                    <td className="question-cell">
                      {item.question}
                    </td>

                    <td className="answer-cell">
                      {item.answer}
                    </td>

                    <td>
                      <span className="category-badge">
                        {item.category}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            startEditing(item)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            deleteKnowledge(item.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <footer className="knowledge-footer">
        <div>
          <strong>Telecom Support Knowledge Assistant</strong>
        </div>

        <p>
          Administrator Knowledge Base Management
        </p>
      </footer>
    </div>
  );
}

export default KnowledgeBase;
    