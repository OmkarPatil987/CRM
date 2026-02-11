import { Typography } from "@mui/material";

const PageLoader = () => {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                margin: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                flexDirection: 'column'
            }}
        >
            {/* <img src={'/images/ngo.png'} alt="loading..." style={{ width: 200 }} /> */}
            <Typography
                variant="h5"
                sx={{
                    mb: 1,
                    color: '#000',
                    margin: '10px 20px !important',
                    fontWeight: '600',
                    textAlign: 'center',
                }}
            >
                Loading Flood Condition & Relief Information...
            </Typography>

        </div>
    );
};
export default PageLoader;
