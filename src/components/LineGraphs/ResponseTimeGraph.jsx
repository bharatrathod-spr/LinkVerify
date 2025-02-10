// import { Box, Card, CardContent, Typography } from "@mui/material";
// import React, { useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { Link } from "react-router-dom";
// import { Grid } from "@material-ui/core";

// function ResponseTimeGraph({ data, title }) {
//   const [activeBar, setActiveBar] = useState(false);

//   const profiles = Array.from(
//     new Map(
//       data.flatMap((item) =>
//         Object.keys(item)
//           .filter((key) => key.startsWith("Profile-") && item[`${key}_id`])
//           .map((key) => [
//             key,
//             {
//               validationProfileId: item[`${key}_id`],
//               description: item[`${key}_description`] || key,
//             },
//           ])
//       )
//     )
//   ).map(([profileKey, { validationProfileId, description }]) => ({
//     profileKey,
//     validationProfileId,
//     description,
//   }));

//   const transformedData = data.map((item) => {
//     const newItem = { ...item };
//     profiles.forEach(({ profileKey, description }) => {
//       if (item[profileKey] !== undefined) {
//         newItem[description] = item[profileKey];
//       }
//     });
//     return newItem;
//   });

//   const renderTooltip = ({ active, payload, label }) => {
//     if (!active || !payload || !payload.length) return null;

//     const uniquePayload = payload.filter((item, index, self) => {
//       return index === self.findIndex((t) => t.name === item.name);
//     });

//     return (
//       <Card
//         sx={{
//           py: 1,
//           px: 2,
//           display: "flex",
//           flexDirection: "column",
//           border: "1px solid #ccc",
//           backgroundColor: "#fff",
//         }}
//       >
//         <Typography variant="h6" mb={1}>
//           {label}
//         </Typography>
//         {uniquePayload.map((item, index) => (
//           <Typography
//             key={index}
//             variant="body2"
//             sx={{
//               color: `hsl(${((index + 1) * 90) % 360}, 80%, 50%)`,
//             }}
//           >
//             {`${
//               item.name.length > 20
//                 ? `${item.name.substring(0, 20)}...`
//                 : item.name
//             } : ${item.value}`}
//           </Typography>
//         ))}
//       </Card>
//     );
//   };

//   const renderLegend = () => (
//     <Box sx={{ flexGrow: 1, px: 5 }}>
//       <Grid container spacing={2} justifyContent="start">
//         {profiles.map(
//           ({ profileKey, validationProfileId, description }, index) => (
//             <Grid item key={profileKey} xs={12} sm={6} md={4}>
//               <Typography
//                 variant="body1"
//                 component={Link}
//                 to={"/user/validation-profile-details"}
//                 state={{ ValidationProfileId: validationProfileId }}
//                 sx={{
//                   display: "block",
//                   textAlign: "start",
//                   cursor: "pointer",
//                   color: `hsl(${((index + 1) * 90) % 360}, 80%, 50%)`,
//                   textDecoration: "none",
//                   overflow: "hidden",
//                   whiteSpace: "nowrap",
//                   textOverflow: "ellipsis",
//                 }}
//               >
//                 {description}
//               </Typography>
//             </Grid>
//           )
//         )}
//       </Grid>
//     </Box>
//   );

//   return (
//     <Card sx={{ width: "100%" }}>
//       <CardContent>
//         <Typography variant="h6" mb={2}>
//           {title}
//         </Typography>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart
//             data={transformedData}
//             style={{ cursor: activeBar && "pointer" }}
//           >
//             <CartesianGrid strokeDasharray="5 5" />
//             <XAxis dataKey="date" />
//             <YAxis
//               domain={[
//                 0,
//                 Math.ceil(
//                   Math.max(
//                     ...data.flatMap((item) =>
//                       profiles.map(
//                         (profile) => parseFloat(item[profile.profileKey]) || 0
//                       )
//                     )
//                   ) / 100
//                 ) * 100,
//               ]}
//               tickFormatter={(value) => Math.ceil(value / 100) * 100}
//             />

//             <Tooltip content={renderTooltip} />

//             <Legend content={renderLegend} />

//             {profiles.map(({ description }, index) => (
//               <Line
//                 key={description}
//                 type="linear"
//                 dataKey={description}
//                 stroke={`hsl(${((index + 1) * 90) % 360}, 80%, 50%)`}
//                 strokeWidth={2}
//                 activeDot={{
//                   onMouseEnter: () => setActiveBar(true),
//                   onMouseLeave: () => setActiveBar(false),
//                 }}
//               />
//             ))}
//           </LineChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// }

// export default ResponseTimeGraph;

import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";

function ResponseTimeGraph({ data, title }) {
  const [activeBar, setActiveBar] = useState(false);

  const profiles = Array.from(
    new Map(
      data.flatMap((item) =>
        Object.keys(item)
          .filter((key) => key.startsWith("Profile-") && item[`${key}_id`])
          .map((key) => [
            key,
            {
              validationProfileId: item[`${key}_id`],
              description: item[`${key}_description`] || key,
            },
          ])
      )
    )
  ).map(([profileKey, { validationProfileId, description }]) => ({
    profileKey,
    validationProfileId,
    description,
  }));

  const transformedData = data.map((item) => {
    const newItem = { ...item };
    profiles.forEach(({ profileKey, description }) => {
      if (item[profileKey] !== undefined) {
        newItem[description] = item[profileKey];
      }
    });
    return newItem;
  });

  const renderTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const uniquePayload = payload.filter((item, index, self) => {
      return index === self.findIndex((t) => t.name === item.name);
    });

    return (
      <Card
        sx={{
          py: 1,
          px: 2,
          display: "flex",
          flexDirection: "column",
          border: "1px solid #ccc",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h6" mb={1}>
          {label}
        </Typography>
        {uniquePayload.map((item, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              color: `hsl(${((index + 1) * 90) % 360}, 80%, 50%)`,
            }}
          >
            {`${
              item.name.length > 20
                ? `${item.name.substring(0, 20)}...`
                : item.name
            } : ${item.value}`}
          </Typography>
        ))}
      </Card>
    );
  };

  const renderLegend = () => (
    <Box sx={{ flexGrow: 1, px: 5 }}>
      <Grid container spacing={2} justifyContent="start">
        {profiles.map(
          ({ profileKey, validationProfileId, description }, index) => (
            <Grid item key={profileKey} xs={12} sm={6} md={4}>
              <Typography
                variant="body1"
                component={Link}
                to={"/user/validation-profile-details"}
                state={{ ValidationProfileId: validationProfileId }}
                sx={{
                  display: "block",
                  textAlign: "start",
                  cursor: "pointer",
                  color: `hsl(${((index + 1) * 90) % 360}, 80%, 50%)`,
                  textDecoration: "none",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {description}
              </Typography>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={transformedData}
            style={{ cursor: activeBar && "pointer" }}
          >
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis
              domain={[
                0,
                Math.ceil(
                  Math.max(
                    ...data.flatMap((item) =>
                      profiles.map(
                        (profile) => parseFloat(item[profile.profileKey]) || 0
                      )
                    )
                  ) / 100
                ) * 100,
              ]}
              tickFormatter={(value) => Math.ceil(value / 100) * 100}
            />
            <Tooltip content={renderTooltip} />
            <Legend content={renderLegend} />
            {profiles.map(({ description }, index) => (
              <Bar
                key={description}
                dataKey={description}
                fill={`hsl(${((index + 1) * 90) % 360}, 80%, 50%)`}
                onMouseEnter={() => setActiveBar(true)}
                onMouseLeave={() => setActiveBar(false)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default ResponseTimeGraph;
