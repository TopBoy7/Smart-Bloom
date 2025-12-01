import streamlit as st
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import plotly.express as px

st.title("🌿 Irrigation Scheduling AI Dashboard")
st.write("A predictive dashboard for estimating irrigation water needs.")

# -----------------------
# FILE UPLOAD
# -----------------------
uploaded_file = st.file_uploader("Upload your Irrigation Scheduling CSV file", type=["csv"])

if uploaded_file:
    df = pd.read_csv(uploaded_file)
    st.success("CSV Loaded Successfully!")
    st.write("### 📄 Dataset Preview")
    st.dataframe(df.head())

    # -----------------------
    # DATA VISUALIZATION
    # -----------------------
    st.write("## 📊 Data Visualizations")

    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()

    if len(numeric_cols) > 0:
        col = st.selectbox("Select a column to visualize:", numeric_cols)
        fig = px.histogram(df, x=col, title=f"Distribution of {col}")
        st.plotly_chart(fig)
    else:
        st.warning("No numeric columns found for visualization.")

    # -----------------------
    # MODEL TRAINING SECTION
    # -----------------------
    st.write("## 🤖 Model Training")

    target = st.selectbox("Select the target (what you want to predict):", numeric_cols)

    feature_cols = [c for c in numeric_cols if c != target]

    if st.button("Train Model"):
        X = df[feature_cols]
        y = df[target]

        # Train Test Split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Scaling
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # Regression Model
        model = RandomForestRegressor(
            n_estimators=300,
            random_state=42
        )
        model.fit(X_train_scaled, y_train)

        # Predictions
        y_pred = model.predict(X_test_scaled)

        # -----------------------
        # MODEL EVALUATION
        # -----------------------
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)

        st.write("### 📈 Model Performance")
        st.write(f"**MAE:** {mae:.3f}")
        st.write(f"**RMSE:** {rmse:.3f}")
        st.write(f"**R² Score:** {r2:.3f}")

        st.success("Model trained successfully!")

        # -----------------------
        # REAL-TIME PREDICTION
        # -----------------------
        st.write("## 🌱 Predict Irrigation Requirement")

        user_inputs = {}

        for feature in feature_cols:
            min_val = float(df[feature].min())
            max_val = float(df[feature].max())
            mean_val = float(df[feature].mean())

            user_inputs[feature] = st.slider(
                feature,
                min_val,
                max_val,
                mean_val
            )

        # Convert to DataFrame
        input_df = pd.DataFrame([user_inputs])
        input_scaled = scaler.transform(input_df)

        # Prediction
        pred_output = model.predict(input_scaled)[0]

        st.write("### 💧 Predicted Irrigation Needed:")
        st.subheader(f"**{pred_output:.2f} units**")

else:
    st.info("Please upload your irrigation dataset to begin.")

