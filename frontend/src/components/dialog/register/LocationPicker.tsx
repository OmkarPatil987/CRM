import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { Autocomplete, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import GlobalDialogContent from '../GlobalDialogContent';
import { useDispatch, useSelector } from 'react-redux';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import { closeDialog } from '../../../redux/reducer/dialogSlice';
import axios from 'axios';
import { setProjectLocation } from '../../../redux/reducer/locationSlice';

const CreateProjectLocation = () => {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const { payload } = useSelector((state: any) => state.dialog);
    const [map, setMap] = useState<Map | null>(null);
    const dispatch = useDispatch();
    const [vectorSource] = useState(new VectorSource());
    const [query, setQuery] = useState(payload);

    useEffect(() => {
        if (payload) {
            setQuery(payload);
            const defaultOption = options?.[1] ?? options?.[0];
            if (defaultOption) {
                setSelectedLocation(defaultOption);
            }
        }
    }, [payload, options]);
      
    const formik = useFormik({
        initialValues: {
            latitude: '',
            longitude: '',
            address: '',
        },
        validationSchema: Yup.object({
            address: Yup.string().required('address is Required'),
        }),
        onSubmit: (values) => {
            dispatch(closeDialog())
            dispatch(setProjectLocation(values));
        },
    });
    useEffect(() => {
        if (payload) { formik.setValues({ latitude: '', longitude: '', address: '', }); }
        dispatch(setProjectLocation({ latitude: '', longitude: '', address: '', }));
    }, [payload, dispatch]);


    useEffect(() => {
        if (query.length < 3) return;
        const fetchLocations = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
                );
                setOptions(response.data);
            } catch (error) {
                console.error("Error fetching locations:", error);
                setOptions([]); 
            } finally {
                setLoading(false);
            }
        };
        const timeoutId = setTimeout(fetchLocations, 500);
        return () => clearTimeout(timeoutId);
    }, [query]);

    useEffect(() => {
        if (!mapRef.current) return;
        const mapInstance = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                new VectorLayer({
                    source: vectorSource,
                }),
            ],
            view: new View({
                center: fromLonLat([72.8777, 19.0760]),
                zoom: 12,
            }),
        });
        setMap(mapInstance);
        mapInstance.on("click", async (event) => {
            try {
                const coordinates = toLonLat(event.coordinate);
                const [lon, lat] = coordinates;
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                );
                if (!response.ok) throw new Error("Failed to fetch location data");
                const data = await response.json();
                const address = data.display_name || "Unknown Location";
                setSelectedLocation({ latitude: lat, longitude: lon, address });
                formik.setValues({ latitude: lat.toString(), longitude: lon.toString(), address });
                updateMarker(lon, lat);
            } catch (error) {
                console.error("Error fetching reverse geolocation:", error);
            }
        });
        return () => mapInstance.setTarget("");
    }, []);
    const updateMarker = (lon: number, lat: number) => {
        vectorSource.clear();
        const marker = new Feature({
            geometry: new Point(fromLonLat([lon, lat])),
        });
        marker.setStyle(
            new Style({
                image: new Icon({
                    anchor: [0.5, 1],
                    src: "https://openlayers.org/en/latest/examples/data/icon.png",
                    scale: 0.5,
                }),
            })
        );
        vectorSource.addFeature(marker);
        if (map) {
            map.getView().setCenter(fromLonLat([lon, lat]));
            map.getView().setZoom(14);
        }
    };
    useEffect(() => {
        if (selectedLocation && selectedLocation.lon && selectedLocation.lat) {
            updateMarker(selectedLocation.lon, selectedLocation.lat);
        }
    }, [selectedLocation, updateMarker]);
    return (
        <form onSubmit={formik.handleSubmit}>
            <GlobalDialogContent
                dialogBody={
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={options}
                                getOptionLabel={(option: any) => option.display_name}
                                filterOptions={(x) => x}
                                onInputChange={(_, newInputValue) => setQuery(newInputValue)}
                                onChange={(_, newValue) => setSelectedLocation(newValue)}
                                loading={loading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search Location"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        {selectedLocation?.address && (
                            <Grid item xs={12}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        p: 1,
                                        border: '1px solid #ccc',
                                        borderRadius: 1,
                                        backgroundColor: '#f9f9f9',
                                        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    <strong> Address:</strong> {selectedLocation.address} |
                                    <strong> Latitude:</strong> {selectedLocation.latitude} |
                                    <strong> Longitude:</strong> {selectedLocation.longitude}

                                </Typography>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <div
                                ref={mapRef}
                                id="map-container"
                                style={{ width: "100%", height: "400px", }}
                            />
                        </Grid>
                    </Grid>
                }
                dialogFooter={
                    <Button type="submit" sx={{borderRadius:3}} variant="contained" color="primary" startIcon={<WhereToVoteIcon />} disabled={!selectedLocation?.address}>
                        Pick this Location
                    </Button>
                }
            />
        </form>
    );
};
export default CreateProjectLocation;