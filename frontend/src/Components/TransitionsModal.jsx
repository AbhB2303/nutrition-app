import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import { useState } from "react";
import { BarcodeScanner } from "./BarcodeScanner";
import { ManualCreateComponent } from "./ManualCreateComponent/ManualCreateComponent";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  scroll: "paper",
};
export const TransitionsModal = ({ open, setOpen }) => {
  const handleClose = () => setOpen(false);

  // 0 = manual, 1 = barcode
  const [createType, setCreateType] = useState(null);
  // camera state
  const [cameraOn, setCameraOn] = useState(false);

  const toggleCamera = () => {
    setCameraOn((prevCameraOn) => !prevCameraOn);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div>
              <div hidden={createType !== null}>
                <Button
                  onClick={() => {
                    setCreateType(0);
                  }}
                >
                  Create Manually
                </Button>
                <Button
                  style={{ margin: "10px" }}
                  key="Scan Barcode"
                  onClick={() => {
                    toggleCamera();
                    setCreateType(1);
                  }}
                >
                  Scan Barcode
                </Button>
              </div>
            </div>
            {/* Create manually component */}
            <div hidden={createType !== 0}>
              <ManualCreateComponent setCreateType={setCreateType} />
            </div>
            {cameraOn && createType === 1 && (
              <BarcodeScanner
                toggleCamera={toggleCamera}
                setCreateType={setCreateType}
              />
            )}
            <Button
              variant="contained"
              onClick={() => {
                setOpen(false);
                setCreateType(null);
                if (createType === 1) {
                  toggleCamera();
                }
              }}
              style={{
                color: "white",
                backgroundColor: "#f44336",
                justifyContent: "center",
              }}
            >
              Close
            </Button>
            {createType !== null && (
              <Button
                onClick={() => {
                  if (createType === 1) {
                    toggleCamera();
                  }
                  setCreateType(null);
                }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                Back
              </Button>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
export default TransitionsModal;
