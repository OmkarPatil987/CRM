import { FormLabel, Grid, Typography } from "@mui/material";

export const RenderFields = (label: string, data: any, isDangerouslyLoadHtml = false, xs?: number, sm?: number, md?: number,) => {
    return (
        <Grid item xs={xs ?? 12} sm={sm ?? 6} md={md ?? 3}>
            <FormLabel sx={{ fontWeight: 'bold' }}>{label} :</FormLabel>
            {!isDangerouslyLoadHtml ?
                (<Typography variant="body1" gutterBottom>
                    {data || "-- NA --"}
                </Typography>) :
                (<Typography variant="body1"
                    gutterBottom
                    dangerouslySetInnerHTML={{ __html: data ?? "N/A" }}
                />)
            }

        </Grid>
    );
}
