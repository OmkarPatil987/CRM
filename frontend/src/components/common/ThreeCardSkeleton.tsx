import { Card, CardContent, Skeleton, Grid } from "@mui/material";

const ThreeCardSkeleton = () => {
    return (
        <Grid container spacing={2}>
            {[1, 2, 3].map((item) => (
                <Grid item xs={12} sm={4} key={item}>
                    <Card sx={{ p: 1 }}>
                        <Skeleton variant="rectangular" width="100%" height={100} />
                        <CardContent>
                            <Skeleton variant="text" width="80%" height={30} />
                            <Skeleton variant="text" width="60%" height={20} />
                        </CardContent>
                    </Card>
                </Grid>
            ))}
            {[1, 2, 3].map((item) => (
                <Grid item xs={12} sm={4} key={item}>
                    <Card sx={{ p: 1 }}>
                        <Skeleton variant="rectangular" width="100%" height={100} />
                        <CardContent>
                            <Skeleton variant="text" width="80%" height={30} />
                            <Skeleton variant="text" width="60%" height={20} />
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ThreeCardSkeleton;
