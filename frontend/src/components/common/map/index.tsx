import React, { useEffect, useRef, useState } from "react";
import { Box, Card, CardContent, CardHeader, darken, IconButton, Tooltip, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useGesture } from "@use-gesture/react";
import RefreshIcon from '@mui/icons-material/Refresh';
import { districts } from "./districtJson";

export type SvgIconNames = "relief-icon" | "donate-online-icon" | "dontion-status-equiry-icon" |
    "top-donars-icon" | "apply-online-icon" | "application-status-icon" | "bullet-icon";

export interface District {
    id: string;
    name: string;
    d: string;
    color: string;
}

interface MaharashtraMapProps {
    onDistrictClick?: (district: District) => void;
}

const MaharashtraMap: React.FC<MaharashtraMapProps> = ({ onDistrictClick }) => {
    const [scale, setScale] = useState(1);
    const [tooltipData, setTooltipData] = useState<{ name: string; x: number; y: number, info?: string } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [districtCenters, setDistrictCenters] = useState<{ [key: string]: { x: number; y: number } }>({});
    const districtRefs = useRef<{ [key: string]: SVGPathElement | null }>({});

    useEffect(() => {
        const newCenters: { [key: string]: { x: number; y: number } } = {};

        Object.keys(districtRefs.current).forEach((districtName) => {
            const pathElement = districtRefs.current[districtName];
            if (pathElement) {
                const bbox = pathElement.getBBox();
                newCenters[districtName] = {
                    x: bbox.x + bbox.width / 2,
                    y: bbox.y + bbox.height / 2,
                };
            }
        });

        setDistrictCenters(newCenters);
    }, []);

    useEffect(() => {
        const handleZoom = (event: WheelEvent) => {
            if (containerRef.current && containerRef.current.contains(event.target as Node)) {
                if (event.ctrlKey) {
                    event.preventDefault();
                    setScale((prev) => Math.min(3, Math.max(0.5, prev + (event.deltaY > 0 ? -0.1 : 0.1))));
                }
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey) {
                if (event.key === "=") {
                    setScale((prev) => Math.min(3, prev + 0.1));
                } else if (event.key === "-") {
                    setScale((prev) => Math.max(0.5, prev - 0.1));
                }
            }
        };

        document.addEventListener("wheel", handleZoom, { passive: false });
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("wheel", handleZoom);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleDistrictClick = (district: District) => {
        setSelectedDistrict(district);
        if (onDistrictClick) {
            onDistrictClick(district);
        }
    };

    const resetHighlight = () => {
        setHoveredDistrict(null);
        setTooltipData(null);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
        if ((event.target as SVGElement).tagName !== "path") setSelectedDistrict(null);
    };

    const bind = useGesture({
        onDrag: ({ offset: [dx, dy] }) => setPosition({ x: dx, y: dy }),
    });

    const getFillColor = (district: District) => {
        if (selectedDistrict?.name === district.name) {
            return darken(district.color, 0.3);
        }
        if (hoveredDistrict === district.name) {
            return darken(district.color, 0.2);
        }
        return district.color;
    };

    return (
        <Box
            ref={containerRef}
            sx={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                touchAction: "none",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
            }}
            {...bind()}
        >
            <Box
                sx={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    zIndex: 10,
                }}
            >
                <IconButton onClick={() => setScale((prev) => Math.min(3, prev + 0.1))}>
                    <AddIcon />
                </IconButton>
                <IconButton onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}>
                    <RemoveIcon />
                </IconButton>
                <IconButton onClick={resetHighlight}>
                    <RefreshIcon />
                </IconButton>
            </Box>

            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "grab",
                }}
            >
                <svg
                    viewBox="0 0 2500 2500"
                    width="100%"
                    height="100%"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: "center",
                    }}
                    onClick={handleMapClick}
                >
                    {districts.map((district) => (
                        <g id={district.id} key={district.id}
                            // transform="matrix(1.25,0,0,1.25,-1177.7231,-694.1366)"
                        >
                            <path
                                ref={(el) => (districtRefs.current[district.name] = el)}
                                d={district.d}
                                fill={getFillColor(district)}
                                stroke="#000"
                                strokeWidth="0.5"
                                fillOpacity={hoveredDistrict === district.name || selectedDistrict?.name === district.name ? 1 : 0.9}
                                filter={hoveredDistrict === district.name || selectedDistrict?.name === district.name ? "drop-shadow(6px 6px 10px rgba(0, 0, 0, 1))" : "none"}
                                style={{
                                    transition: "all 0.3s ease-in-out",
                                    transform: hoveredDistrict === district.name || selectedDistrict?.name === district.name ? "scale(1.01)" : "scale(1)",
                                    transformOrigin: "center",
                                }}
                                onMouseEnter={() => setHoveredDistrict(district.name)}
                                onMouseMove={(e) => setTooltipData({ name: district.name, x: e.clientX, y: e.clientY })}
                                onMouseLeave={() => {
                                    setHoveredDistrict(null);
                                    setTooltipData(null);
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDistrictClick(district)
                                }}
                                transform="matrix(0.8,0,0,0.8,-3.2e-4,-0.002752)"
                            />
                        </g>
                    ))}

                    {districts.map((district) =>
                        districtCenters[district.name] && (
                            <text
                                key={district.id}
                                x={districtCenters[district.name].x}
                                y={districtCenters[district.name].y}
                                textAnchor="middle"
                                fontSize="28"
                                fontWeight="bold"
                                fill="black"
                                stroke="white"
                                strokeWidth="2"
                                paintOrder="stroke"
                            >
                                {district.name}
                            </text>
                        )
                    )}
                </svg>
            </Box>
            {
                tooltipData && tooltipData?.info && (
                    <Card
                        sx={{
                            position: "fixed",
                            top: tooltipData.y + 15,
                            left: tooltipData.x + 15,
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                            borderRadius: 1,
                            padding: "4px 12px",
                            minWidth: "180px",
                            maxWidth: "250px",
                            zIndex: 9999,
                            pointerEvents: "none",
                            transition: "opacity 0.2s ease-in-out",
                        }}
                    >
                        <CardHeader
                            title={tooltipData.name}
                        />
                        <CardContent>
                            <Typography variant="body2" color="textSecondary">
                                {tooltipData.info}
                            </Typography>

                        </CardContent>
                    </Card>
                )
            }
        </Box >
    );
};

export default MaharashtraMap;