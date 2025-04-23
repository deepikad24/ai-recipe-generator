import { FormEvent, useState } from "react";
import { Loader } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const { data, errors } = await amplifyClient.queries.askBedrock({
        ingredients: [formData.get("ingredients")?.toString() || ""],
      });

      if (!errors) {
        setResult(data?.body || "No data returned");
      } else {
        console.log(errors);
      }
    } catch (e) {
      alert(`An error occurred: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <div className="ai-header">
          <img src="/assets/deepu-3d-avatar.png" alt="Deepu AI" className="avatar" />
          <div className="intro-text">
            <h1 className="main-header gradient-text">Hello Chef</h1>
            <p className="ai-badge gradient-sub">Powered by DEEPU AI</p>
          </div>
        </div>
        <p className="deepu-name premium-text">
          <strong>D.E.E.P.U.</strong> – Data-Enhanced Engine for Preparing Unforgettable Recipes
        </p>
        <p className="sub-description premium-text">your personal AI Chef </p>
        <p className="instruction-text">
          Type a few ingredients below and get a premium recipe crafted by AI.
        </p>

        {/* Elegant soft divider */}
        <hr className="section-divider" />
      </div>

      <form onSubmit={onSubmit} className="form-container">
        <div className="search-container">
          <input
            type="text"
            className="wide-input"
            id="ingredients"
            name="ingredients"
            placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
          />
          <button type="submit" className="search-button">
            Generate
          </button>
        </div>
      </form>

      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p className="loading-text">
              Your recipe is cooking<span className="dots">...</span>
            </p>
            <Loader size="large" />
          </div>
        ) : (
          result && <div className="result-wrapper">
          <p className="result">{result}</p>
        </div>
        )}
      </div>
    </div>
  );
}

export default App;
