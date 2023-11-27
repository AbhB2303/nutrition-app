import { useState } from "react";
import { useZxing } from "react-zxing";
import axios from "axios";
import { useEffect } from "react";

export const BarcodeScanner = () => {
  const REACT_API_SERVER_URL = process.env.REACT_APP_API_SERVER_URL;
  const [result, setResult] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(false); // New state for camera status

  function stopCamera() {
    const stream = ref.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function (track) {
      track.stop();
    });
  }

  useEffect(() => {
    if (result) {
      stopCamera();
    }
  }, [result]);

  const { ref } = useZxing({
    async onDecodeResult(result) {
      const response = await axios
        .get(REACT_API_SERVER_URL + "/scan/" + result.text)
        .then((response) => {
          setResult(response.data);
        });
    },
  });

  // Function to start the camera
  const startCamera = () => {
    const stream = ref.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(function (track) {
        track.start();
      });
    }
  };

  // Start the camera when the component is mounted
  useEffect(() => {
    if (!isCameraOn) {
      startCamera();
    }

    // Cleanup function to stop the camera when the component is unmounted
    return () => {
      if (isCameraOn) {
        stopCamera();
        setIsCameraOn(false);
      }
    };
  }, [isCameraOn]);

  return (
    <div
      style={{
        textAlign: "center",
        margin: "auto",
      }}
    >
      <h1>Place item within view of your camera</h1>
      <video
        autoPlay
        muted
        ref={ref}
        style={{ width: "50%" }}
        hidden={result}
      />
      {result && (
        <div>
          <h1>Result</h1>
          {result["message"] && result["message"].includes("usage limits") ? (
            <h2>Usage limits exceeded, please try again tomorrow</h2>
          ) : (
            <h2>Product not found</h2>
          )}

          {result["foods"] && (
            <div>
              <h2>Food</h2>
              <ul>
                {result["foods"].map((food) => (
                  <div>
                    <p>{food["food_name"]}</p>
                    <p>{food["brand_name"]}</p>
                    {food["full_nutrients"].map((nutrient) => (
                      <li>
                        {nutrient["attr_id"]} : {nutrient["value"]}
                      </li>
                    ))}
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
