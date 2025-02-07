// import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// function SuccessFailureGraph({ data, title }) {
//   const [activeBar, setActiveBar] = useState(false);

//   const uniqueProfiles = Object.keys(data[0] || {})
//     .filter(
//       (key) =>
//         key !== "date" && !key.includes("_id") && !key.includes("_description")
//     )
//     .map((profile) => {
//       const idKey = `${profile}_id`;
//       const profileKey = `${profile}_description`;
//       const firstMatch = data.find((item) => item[idKey]);
//       const newProfile = data.find((item) => item[profileKey]);
//       return {
//         profile,
//         label: newProfile ? newProfile[profileKey] : null,
//         id: firstMatch ? firstMatch[idKey] : null,
//       };
//     });

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       const uniquePayload = payload.filter((item) => item.value !== 0);
//       if (!uniquePayload.length) return;

//       return (
//         <Card
//           className="custom-tooltip"
//           sx={{ py: 1, px: 2, display: "flex", flexDirection: "column" }}
//         >
//           <Typography variant="h6">{label}</Typography>
//           {uniquePayload.map((item, index) => (
//             <Typography
//               key={index}
//               variant="caption"
//               sx={{
//                 color: `hsl(${((index + 1) * 90) % 360}, 80%, 50%)`,
//                 fontSize: "16px",
//               }}
//             >
//               {`${item.payload[`${item.name}_description`]?.substring(0, 20)}${
//                 item.payload[`${item.name}_description`]?.length > 20
//                   ? "..."
//                   : ""
//               } : ${item.value}`}
//             </Typography>
//           ))}
//         </Card>
//       );
//     }
//     return null;
//   };

//   const renderLegend = () => (
//     <Box sx={{ flexGrow: 1, px: 5 }}>
//       <Grid container spacing={2} justifyContent="start">
//         {uniqueProfiles.map(({ profile, id, label }, index) => (
//           <Grid item key={profile} xs={12} sm={6} md={4}>
//             <Typography
//               variant="body1"
//               component={Link}
//               to="/user/validation-profile-details"
//               state={{ ValidationProfileId: id }}
//               sx={{
//                 display: "block",
//                 cursor: "pointer",
//                 textAlign: "start",
//                 color: `hsl(${((index + 1) * 90) % 360}, 80%, 50%)`,
//                 textDecoration: "none",
//                 overflow: "hidden",
//                 whiteSpace: "nowrap",
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {label}
//             </Typography>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );

//   return (
//     <Card sx={{ width: "100%" }}>
//       <CardContent>
//         <Typography variant="h6" mb={2}>
//           {title}
//         </Typography>
//         <ResponsiveContainer height={300}>
//           <BarChart data={data} barSize={20}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />

//             <Tooltip
//               content={<CustomTooltip />}
//               cursor={{
//                 fill: "transparent",
//               }}
//               active={activeBar}
//             />

//             <Legend content={renderLegend} />

//             {uniqueProfiles.map(({ profile }, index) => (
//               <Bar
//                 key={`${profile}`}
//                 dataKey={profile}
//                 fill={`hsl(${((index + 1) * 90) % 360}, 80%, 50%)`}
//                 onMouseEnter={() => setActiveBar(true)}
//                 onMouseLeave={() => setActiveBar(false)}
//                 style={{ cursor: "pointer" }}
//               />
//             ))}
//           </BarChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// }

// export default SuccessFailureGraph;

import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function SuccessFailureGraph({ data, title }) {
  const [activeLine, setActiveLine] = useState(false);

  const uniqueProfiles = Object.keys(data[0] || {})
    .filter(
      (key) =>
        key !== "date" && !key.includes("_id") && !key.includes("_description")
    )
    .map((profile) => {
      const idKey = `${profile}_id`;
      const profileKey = `${profile}_description`;
      const firstMatch = data.find((item) => item[idKey]);
      const newProfile = data.find((item) => item[profileKey]);
      return {
        profile,
        label: newProfile ? newProfile[profileKey] : null,
        id: firstMatch ? firstMatch[idKey] : null,
      };
    });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const uniquePayload = payload.filter((item) => item.value !== 0);
      if (!uniquePayload.length) return;

      return (
        <Card
          className="custom-tooltip"
          sx={{ py: 1, px: 2, display: "flex", flexDirection: "column" }}
        >
          <Typography variant="h6">{label}</Typography>
          {uniquePayload.map((item, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{
                color: `hsl(${((index + 1) * 90) % 360}, 80%, 50%)`,
                fontSize: "16px",
              }}
            >
              {`${item.payload[`${item.name}_description`]?.substring(0, 20)}${
                item.payload[`${item.name}_description`]?.length > 20
                  ? "..."
                  : ""
              } : ${item.value}`}
            </Typography>
          ))}
        </Card>
      );
    }
    return null;
  };

  const renderLegend = () => (
    <Box sx={{ flexGrow: 1, px: 5 }}>
      <Grid container spacing={2} justifyContent="start">
        {uniqueProfiles.map(({ profile, id, label }, index) => (
          <Grid item key={profile} xs={12} sm={6} md={4}>
            <Typography
              variant="body1"
              component={Link}
              to="/user/validation-profile-details"
              state={{ ValidationProfileId: id }}
              sx={{
                display: "block",
                cursor: "pointer",
                textAlign: "start",
                color: `hsl(${((index + 1) * 90) % 360}, 80%, 50%)`,
                textDecoration: "none",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {label}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>
        <ResponsiveContainer height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />

            <Tooltip content={<CustomTooltip />} />

            <Legend content={renderLegend} />

            {uniqueProfiles.map(({ profile }, index) => (
              <Line
                key={`${profile}`}
                type="monotone"
                dataKey={profile}
                stroke={`hsl(${((index + 1) * 90) % 360}, 80%, 50%)`}
                activeDot={{ r: 8 }}
                onMouseEnter={() => setActiveLine(true)}
                onMouseLeave={() => setActiveLine(false)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default SuccessFailureGraph;
