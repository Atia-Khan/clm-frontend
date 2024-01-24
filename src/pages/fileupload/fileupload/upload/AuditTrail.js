// import React, { useState, useEffect } from "react";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import { styled } from "@mui/material/styles";
// import Timeline from "@mui/lab/Timeline";
// import TimelineItem from "@mui/lab/TimelineItem";
// import TimelineSeparator from "@mui/lab/TimelineSeparator";
// import TimelineConnector from "@mui/lab/TimelineConnector";
// import TimelineContent from "@mui/lab/TimelineContent";
// import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
// import TimelineDot from "@mui/lab/TimelineDot";
// import Chip from "@mui/material-next/Chip";
// import Paper from "@mui/material/Paper";
// import Stack from "@mui/material/Stack";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import Divider from "@mui/joy/Divider";
// import axios from "axios";
// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";
// import IconButton from "@mui/material/IconButton";
// import { Tooltip } from "@mui/material";

// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";

// const CustomizedPaper1 = styled(Paper)(({ theme }) => ({
//   width: 425,
//   height: 85,
//   padding: theme.spacing(2),
// }));
// const CustomizedPaper2 = styled(Paper)(({ theme }) => ({
//   width: 425,
//   height: 105,
//   padding: theme.spacing(2),
// }));

// const CustomizedPaper3 = styled(Paper)(({ theme }) => ({
//   width: 425,
//   height: 95,
//   padding: theme.spacing(2),
// }));

// const Root = styled("div")(({ theme }) => ({
//   width: "100%",
//   ...theme.typography.body2,
//   color: theme.palette.text.secondary,
//   "& > :not(style) ~ :not(style)": {
//     marginTop: theme.spacing(2),
//   },
// }));
// const AuditTrail = ({ open, onClose, data }) => {
//   const [auditData, setAuditData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);

//       try {
//         if (data && data.envelope_id && data.recipient && data.recipient.name) {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/file/get_audit_events/`,
//             {
//               params: {
//                 envelope_id: data.envelope_id,
//                 user_name: data.recipient.name,
//               },
//             }
//           );

//           const allDates = [
//             ...response.data.document_opened_dates.map((date) => ({
//               type: "open",
//               date,
//             })),
//             ...response.data.document_viewed_dates.map((date) => ({
//               type: "view",
//               date,
//             })),
//           ];

//           if (response.data.document_signed_date) {
//             allDates.push({
//               type: "signed",
//               date: response.data.document_signed_date,
//             });
//           }

//           const sortedDates = allDates.sort(
//             (a, b) => new Date(a.date) - new Date(b.date)
//           );

//           setAuditData({
//             document_opened_dates: response.data.document_opened_dates,
//             document_viewed_dates: response.data.document_viewed_dates,
//             document_signed_date: response.data.document_signed_date,
//             allDates: sortedDates,
//           });

//           setIsLoading(false);

//           console.log("audit trail response ", response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching audit data", data);
//       }
//     };

//     fetchData();
//   }, [data]);

//   if (!data || !data.recipient) {
//     return null;
//   }

//   const formatDateAndTime = (dateTime) => {
//     const options = {
//       year: "numeric",
//       month: "numeric",
//       day: "numeric",
//       hour: "numeric",
//       minute: "numeric",
//       second: "numeric",
//       hour12: true,
//     };

//     return dateTime.toLocaleString(undefined, options);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth="md"
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         height: "100%",
//       }}
//     >
//       <Tooltip title="close" arrow>
//         <IconButton
//           aria-label="close"
//           onClick={onClose}
//           className="no-print"
//           sx={{
//             position: "absolute",
//             right: 14,
//             top: 8,
//             color: (theme) => theme.palette.grey[500],
//             "& .MuiSvgIcon-root": {
//               fontSize: "30px",
//             },
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </Tooltip>

//       <h1 className="text-center text-xl font-bold  font-body mt-4">
//         {" "}
//         Audit Trail
//       </h1>
//       {/* <DialogActions className="mt-2 mb-3" sx={{ justifyContent: "center" }}> */}

//       <DialogActions className="mt-4 mb-2" sx={{ justifyContent: 'center' }}>
//                 <h1 className="text-center text-xl  font-body mt-4 ml-44">  {data.fileName}  </h1>


//         <Typography
//           sx={{ mt: 3, mr: 24 }}
//           color="text.secondary"
//           variant="body2"
//         >
//           {data.recipient.documentSigned ? (
//             <Chip
//               color="success"
//               size="small"
//               variant="elevated"
//               label="Signed"
//             />
//           ) : (
//             <Chip
//               color="error"
//               size="small"
//               variant="elevated"
//               label="Not Signed"
//             />
//           )}
//         </Typography>
//       </DialogActions>

//       <DialogContent>
//         {isLoading && (
//           <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-sm z-50">
//             <div
//               role="status"
//               class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
//             >
//               <svg
//                 aria-hidden="true"
//                 class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
//                 viewBox="0 0 100 101"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
//                   fill="currentColor"
//                 />
//                 <path
//                   d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
//                   fill="currentFill"
//                 />
//               </svg>
//               <span class="sr-only">Loading...</span>
//             </div>
//           </div>
//         )}
//         <Timeline align="alternate">
//           <TimelineItem>
//             <TimelineOppositeContent
//               sx={{ m: "auto 0", my: 3, mx: -2 }}
//               align="right"
//               variant="body2"
//             >
//               <Typography variant="h7" component="span" color="text.secondary">
//                 {data.requestedTime &&
//                   new Date(data.requestedTime.toDate()).getFullYear()}
//               </Typography>
//               <Typography>
//                 {data.requestedTime &&
//                   new Date(data.requestedTime.toDate()).toLocaleDateString(
//                     undefined,
//                     {
//                       day: "numeric",
//                     }
//                   )}
//               </Typography>
//               <Typography>
//                 {data.requestedTime &&
//                   new Date(data.requestedTime.toDate()).toLocaleDateString(
//                     undefined,
//                     {
//                       month: "long",
//                     }
//                   )}
//               </Typography>
//             </TimelineOppositeContent>
//             <TimelineSeparator>
//               <TimelineDot color="success" />
//               <TimelineConnector />
//             </TimelineSeparator>
//             <TimelineContent>
//               <Root>
//                 <Divider sx={{ mb: 2 }}>
//                   Earlier in{" "}
//                   {data.requestedTime &&
//                     new Date(data.requestedTime.toDate()).toLocaleDateString(
//                       undefined,
//                       {
//                         day: "numeric",
//                         month: "long",
//                       }
//                     )}
//                   ,{" "}
//                   {data.requestedTime &&
//                     new Date(data.requestedTime.toDate()).getFullYear()}
//                 </Divider>
//               </Root>
//               <CustomizedPaper1 elevation={3}>
//                 <Stack
//                   direction="row"
//                   justifyContent="space-between"
//                   alignItems="center"
//                 >
//                   <Chip
//                     color="info"
//                     size="small"
//                     variant="elevated"
//                     label="Created"
//                     sx={{ mb: 1.5 }}
//                   />
//                   <Typography
//                     sx={{ mb: 2 }}
//                     color="text.secondary"
//                     variant="body2"
//                   >
//                     <AccessTimeIcon
//                       sx={{
//                         verticalAlign: "middle",
//                         marginRight: 0.5,
//                         marginTop: -0.7,
//                         fontSize: "1rem",
//                       }}
//                     />
//                     {data.requestedTime &&
//                       new Date(data.requestedTime.toDate()).toLocaleDateString(
//                         undefined,
//                         {
//                           day: "numeric",
//                           month: "short",
//                           weekday: "short",
//                           month: "short",
//                           year: "numeric",
//                         }
//                       )}
//                     ,{" "}
//                     {data.requestedTime &&
//                       new Date(
//                         data.requestedTime.toDate()
//                       ).toLocaleTimeString()}
//                   </Typography>
//                 </Stack>
//                 <Typography
//                   sx={{ mt: 0.3 }}
//                   color="text.secondary"
//                   variant="body2"
//                 >
//                   Created by {data.owner}
//                 </Typography>
//               </CustomizedPaper1>
//             </TimelineContent>
//           </TimelineItem>
//           <TimelineItem>
//             <TimelineOppositeContent
//               sx={{ m: "auto 0", my: 3, mx: -2 }}
//               align="right"
//               variant="body2"
//             >
//               <Typography variant="h7" component="span" color="text.secondary">
//                 {data.requestedTime &&
//                   new Date(data.requestedTime.toDate()).getFullYear()}
//               </Typography>
//               <Typography>
//                 {data.requestedTime &&
//                   new Date(data.requestedTime.toDate()).toLocaleDateString(
//                     undefined,
//                     {
//                       day: "numeric",
//                     }
//                   )}
//               </Typography>
//               <Typography>
//                 {data.requestedTime &&
//                   new Date(data.requestedTime.toDate()).toLocaleDateString(
//                     undefined,
//                     {
//                       month: "long",
//                     }
//                   )}
//               </Typography>
//             </TimelineOppositeContent>
//             <TimelineSeparator>
//               <TimelineDot color="success" />
//               <TimelineConnector />
//             </TimelineSeparator>
//             <TimelineContent>
//               <CustomizedPaper2 elevation={3}>
//                 <Stack
//                   direction="row"
//                   justifyContent="space-between"
//                   alignItems="center"
//                 >
//                   <Chip
//                     color="info"
//                     size="small"
//                     variant="elevated"
//                     label="Sent"
//                     sx={{ mb: 1.5 }}
//                   />
//                   <Typography
//                     sx={{ mb: 1.5 }}
//                     color="text.secondary"
//                     variant="body2"
//                   >
//                     <AccessTimeIcon
//                       sx={{
//                         verticalAlign: "middle",
//                         marginRight: 0.5,
//                         marginTop: -0.7,
//                         fontSize: "1rem",
//                       }}
//                     />
//                     {data.requestedTime &&
//                       new Date(data.requestedTime.toDate()).toLocaleDateString(
//                         undefined,
//                         {
//                           day: "numeric",
//                           month: "short",
//                           weekday: "short",
//                           month: "short",
//                           year: "numeric",
//                         }
//                       )}
//                     ,{" "}
//                     {data.requestedTime &&
//                       new Date(
//                         data.requestedTime.toDate()
//                       ).toLocaleTimeString()}{" "}
//                   </Typography>
//                 </Stack>
//                 <Typography
//                   sx={{ mt: 0.4 }}
//                   color="text.secondary"
//                   variant="body2"
//                 >
//                   Sent to {data.recipient.name}
//                 </Typography>
//                 <Typography
//                   sx={{ mt: 0.4 }}
//                   color="text.secondary"
//                   variant="body2"
//                 >
//                   {data.recipient.email}{" "}
//                 </Typography>
//               </CustomizedPaper2>
//             </TimelineContent>
//           </TimelineItem>

//           {auditData &&
//             auditData.allDates &&
//             auditData.allDates.map((event, index) => (
//               <TimelineItem key={index}>
//                 <TimelineOppositeContent
//                   sx={{ m: "auto 0", my: 3, mx: -2 }}
//                   align="right"
//                   variant="body2"
//                 >
//                   <Typography
//                     variant="h7"
//                     component="span"
//                     color="text.secondary"
//                   >
//                     {new Date(event.date).getFullYear()}
//                   </Typography>
//                   <Typography>
//                     {new Date(event.date).toLocaleDateString(undefined, {
//                       day: "numeric",
//                     })}
//                   </Typography>
//                   <Typography>
//                     {new Date(event.date).toLocaleDateString(undefined, {
//                       month: "long",
//                     })}
//                   </Typography>
//                 </TimelineOppositeContent>
//                 <TimelineSeparator>
//                   <TimelineDot
//                     color={event.type === "view" ? "success" : "primary"}
//                   />
//                   <TimelineConnector />
//                 </TimelineSeparator>
//                 <TimelineContent>
//                   {event.type === "signed" && data.recipient.documentSigned ? (
//                     <CustomizedPaper3 elevation={3}>
//                       <Typography
//                         sx={{ mb: 1.5 }}
//                         color="text.secondary"
//                         variant="body2"
//                       >
//                         <Chip
//                           color="success"
//                           size="small"
//                           variant="elevated"
//                           label="Signed"
//                         />
//                       </Typography>
//                       <Typography
//                         sx={{ mt: 0.4 }}
//                         color="text.secondary"
//                         variant="body2"
//                       >
//                         {data.recipient.name} signed on
//                         <AccessTimeIcon
//                           sx={{
//                             verticalAlign: "middle",
//                             marginRight: 0.2,
//                             marginTop: -0.3,
//                             marginLeft: 0.6,
//                             fontSize: "1rem",
//                           }}
//                         />{" "}
//                         {new Date(event.date).toLocaleString(undefined, {
//                           day: "numeric",
//                           month: "short",
//                           weekday: "short",
//                           year: "numeric",
//                           hour: "numeric",
//                           minute: "numeric",
//                         })}
//                       </Typography>
//                     </CustomizedPaper3>
//                   ) : (
//                     <CustomizedPaper3 elevation={3}>
//                       <Typography
//                         sx={{ mb: 1.5 }}
//                         color="text.secondary"
//                         variant="body2"
//                       >
//                         {event.type === "view" ? (
//                           <Chip
//                             color="info"
//                             size="small"
//                             variant="elevated"
//                             label="Viewed"
//                           />
//                         ) : (
//                           <Chip
//                             color="primary"
//                             size="small"
//                             variant="elevated"
//                             label="Opened"
//                           />
//                         )}
//                       </Typography>
//                       <Typography
//                         sx={{ mt: 0.4 }}
//                         color="text.secondary"
//                         variant="body2"
//                       >
//                         {data.recipient.name} last{" "}
//                         {event.type === "view" ? "viewed" : "opened"} on
//                         <AccessTimeIcon
//                           sx={{
//                             verticalAlign: "middle",
//                             marginRight: 0.2,
//                             marginTop: -0.3,
//                             marginLeft: 0.6,

//                             fontSize: "1rem",
//                           }}
//                         />{" "}
//                         {new Date(event.date).toLocaleString(undefined, {
//                           day: "numeric",
//                           month: "short",
//                           weekday: "short",
//                           year: "numeric",
//                           hour: "numeric",
//                           minute: "numeric",
//                         })}
//                       </Typography>
//                     </CustomizedPaper3>
//                   )}
//                 </TimelineContent>
//               </TimelineItem>
//             ))}
//         </Timeline>
//       </DialogContent>

//       <DialogActions className="mt-4" sx={{ justifyContent: 'center' }}>
              
//               <Button onClick={handlePrint} startIcon={<PrintIcon />} sx={{ mt: 4, }} className="no-print">
//                   Print
//               </Button>
//           </DialogActions>
//           <style>
//               {`
//               @media print {
//                   .no-print {
//                       display: none !important;
//                   }
//               }
//           `}
//           </style>
//       </Dialog>
//   );
// };

// export default AuditTrail;


import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from '@mui/material/styles';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Chip from '@mui/material-next/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Divider from '@mui/joy/Divider';
import axios from "axios";
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Tooltip } from "@mui/material";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';



const CustomizedPaper1 = styled(Paper)(({ theme }) => ({
    width: 425,
    height: 85,
    padding: theme.spacing(2),
}));
const CustomizedPaper2 = styled(Paper)(({ theme }) => ({
    width: 425,
    height: 105,
    padding: theme.spacing(2),
}));

const CustomizedPaper3 = styled(Paper)(({ theme }) => ({
    width: 425,
    height: 95,
    padding: theme.spacing(2),
}));


const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
        marginTop: theme.spacing(2),

    },
}));
const AuditTrail = ({ open, onClose, data }) => {
    const [auditData, setAuditData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                if (data && data.envelope_id && data.recipient && data.recipient.name) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/file/get_audit_events/`, {
                        params: {
                            envelope_id: data.envelope_id,
                            user_name: data.recipient.name
                        },
                    });

                    const allDates = [
                        ...response.data.document_opened_dates.map(date => ({ type: 'open', date })),
                        ...response.data.document_viewed_dates.map(date => ({ type: 'view', date })),
                    ];

                    if (response.data.document_signed_date) {
                        allDates.push({ type: 'signed', date: response.data.document_signed_date });
                    }

                    const sortedDates = allDates.sort((a, b) => new Date(a.date) - new Date(b.date));

                    setAuditData({
                        document_opened_dates: response.data.document_opened_dates,
                        document_viewed_dates: response.data.document_viewed_dates,
                        document_signed_date: response.data.document_signed_date,
                        allDates: sortedDates,
                    });

                    setIsLoading(false);

                    console.log('audit trail response ', response.data);
                }
            } catch (error) {
                console.error('Error fetching audit data', data);
            }
        };


        fetchData();
    }, [data]);

    if (!data || !data.recipient) {
        return null;
    }

    const formatDateAndTime = (dateTime) => {
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        };

        return dateTime.toLocaleString(undefined, options);
    };

    const handlePrint = () => {
        window.print();
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', }}>
        <Tooltip title="close" arrow>
        
        <IconButton
        aria-label="close"
        onClick={onClose}  className="no-print"
        sx={{
          position: 'absolute',
          right: 14,
          top: 8,
          color: (theme) => theme.palette.grey[500],
          "& .MuiSvgIcon-root": {
            fontSize: '30px',
        },

        
        }}
      >
      
        <CloseIcon />
      </IconButton>       
        </Tooltip>

      
      <h1 className="text-center text-xl font-bold  font-body mt-4"> Audit Trail</h1>


            <DialogActions className="mt-4" sx={{ justifyContent: 'center' }}>
                <h1 className="text-center text-xl  font-body mt-4 ml-44">  {data.fileName}  </h1>

                <Typography sx={{ mt: 3, mr: 24 }}
                    color="text.secondary" variant="body2">


                    {data.recipient.documentSigned ? (
                        <Chip
                            color="success"
                            size="small"
                            variant="elevated"
                            label="Signed"
                        />
                    ) : (
                        <Chip
                            color="error"
                            size="small"
                            variant="elevated"
                            label="Not Signed"
                        />
                    )}


                </Typography>

            </DialogActions>

          
            <DialogContent sx={{ height: 500, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <CircularProgress />
                </div>
            ) : (
                <Timeline align="alternate">
                    <TimelineItem  >

                        <TimelineOppositeContent
                            sx={{ m: 'auto 0', my: 3, mx: -2 }}
                            align="right"
                            variant="body2"
                        >
                            <Typography variant="h7" component="span" color="text.secondary">
                                {data.requestedTime &&
                                    new Date(data.requestedTime.toDate()).getFullYear()}
                            </Typography>
                            <Typography >
                                {data.requestedTime &&
                                    new Date(data.requestedTime.toDate()).toLocaleDateString(undefined, {
                                        day: 'numeric',
                                    })}
                            </Typography>
                            <Typography >
                                {data.requestedTime &&
                                    new Date(data.requestedTime.toDate()).toLocaleDateString(undefined, {
                                        month: 'long'
                                    })}
                            </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color="success" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Root>
                                <Divider sx={{ mb: 2 }}>
                                    Earlier in {data.requestedTime &&
                                        new Date(data.requestedTime.toDate()).toLocaleDateString(undefined, {
                                            day: 'numeric',
                                            month: 'long'
                                        })}
                                    , {data.requestedTime &&
                                        new Date(data.requestedTime.toDate()).getFullYear()}
                                </Divider>
                            </Root>
                            <CustomizedPaper1 elevation={3}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Chip
                                        color="info"
                                        size="small"
                                        variant="elevated"
                                        label="Created"
                                        sx={{ mb: 1.5 }}
                                    />
                                    <Typography sx={{ mb: 2 }}
                                        color="text.secondary" variant="body2">
                                        <AccessTimeIcon
                                            sx={{
                                                verticalAlign: 'middle',
                                                marginRight: 0.5,
                                                marginTop: -0.6,
                                                fontSize: '1rem',
                                            }}
                                        />
                                        {data.requestedTime &&
                                            new Date(data.requestedTime.toDate()).toLocaleDateString(undefined, {
                                                day: 'numeric',
                                                month: 'short',
                                                weekday: 'short',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        , {data.requestedTime &&
                                            new Date(data.requestedTime.toDate()).toLocaleTimeString()}
                                    </Typography>
                                </Stack>
                                <Typography sx={{ mt: 0.3 }} color="text.secondary" variant="body2">
                                    Created by  {data.owner}
                                </Typography>
                            </CustomizedPaper1>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineOppositeContent
                            sx={{ m: 'auto 0', my: 3, mx: -2 }}
                            align="right"
                            variant="body2"
                        >
                            <Typography variant="h7" component="span" color="text.secondary">
                                {data.requestedTime &&
                                    new Date(data.requestedTime.toDate()).getFullYear()}
                            </Typography>
                            <Typography >
                                {data.requestedTime &&
                                    new Date(data.requestedTime.toDate()).toLocaleDateString(undefined, {
                                        day: 'numeric',
                                    })}
                            </Typography>
                            <Typography >
                                {data.requestedTime &&
                                    new Date(data.requestedTime.toDate()).toLocaleDateString(undefined, {
                                        month: 'long'
                                    })}
                            </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color="success" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <CustomizedPaper2 elevation={3}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Chip
                                        color="info"
                                        size="small"
                                        variant="elevated"
                                        label="Sent"
                                        sx={{ mb: 1.5 }}
                                    />
                                    <Typography sx={{ mb: 1.5 }}
                                        color="text.secondary" variant="body2">
                                        <AccessTimeIcon
                                            sx={{
                                                verticalAlign: 'middle',
                                                marginRight: 0.5,
                                                marginTop: -0.6,
                                                fontSize: '1rem',
                                            }}
                                        />
                                        {data.requestedTime &&
                                            new Date(data.requestedTime.toDate()).toLocaleDateString(undefined, {
                                                day: 'numeric',
                                                month: 'short',
                                                weekday: 'short',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        , {data.requestedTime &&
                                            new Date(data.requestedTime.toDate()).toLocaleTimeString()}                                    </Typography>
                                </Stack>
                                <Typography sx={{ mt: 0.4 }} color="text.secondary" variant="body2">
                                    Sent to    {data.recipient.name}
                                </Typography>
                                <Typography sx={{ mt: 0.4 }} color="text.secondary" variant="body2">
                                    {data.recipient.email}                                </Typography>
                            </CustomizedPaper2>
                        </TimelineContent>
                    </TimelineItem>

                    {auditData &&
                        auditData.allDates &&
                        auditData.allDates.map((event, index) => (
                            <TimelineItem key={index}>
                                <TimelineOppositeContent
                                    sx={{ m: 'auto 0', my: 3, mx: -2 }}
                                    align="right"
                                    variant="body2"
                                >
                                    <Typography variant="h7" component="span" color="text.secondary">
                                        {new Date(event.date).getFullYear()}
                                    </Typography>
                                    <Typography>
                                        {new Date(event.date).toLocaleDateString(undefined, {
                                            day: 'numeric',
                                        })}
                                    </Typography>
                                    <Typography>
                                        {new Date(event.date).toLocaleDateString(undefined, {
                                            month: 'long'
                                        })}
                                    </Typography>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot color={event.type === 'view' ? 'success' : 'primary'} />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                    {event.type === 'signed' && data.recipient.documentSigned ? (
                                        <CustomizedPaper3 elevation={3}>
                                            <Typography sx={{ mb: 1.5 }}
                                                color="text.secondary" variant="body2">
                                                <Chip
                                                    color="success"
                                                    size="small"
                                                    variant="elevated"
                                                    label="Signed"
                                                />
                                            </Typography>
                                            <Typography sx={{ mt: 0.4 }} color="text.secondary" variant="body2">
                                                {data.recipient.name}  signed on
                                                <AccessTimeIcon
                                                    sx={{
                                                        verticalAlign: 'middle',
                                                        marginRight: 0.2,
                                                        marginTop: -0.3,
                                                        marginLeft: 0.6,
                                                        fontSize: '1rem',
                                                    }}
                                                /> {new Date(event.date).toLocaleString(undefined, {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                })}
                                            </Typography>
                                        </CustomizedPaper3>
                                    ) : (
                                        <CustomizedPaper3 elevation={3}>
                                            <Typography sx={{ mb: 1.5 }}
                                                color="text.secondary" variant="body2">
                                                {event.type === 'view' ? (
                                                    <Chip
                                                        color="info"
                                                        size="small"
                                                        variant="elevated"
                                                        label="Viewed"
                                                    />
                                                ) : (
                                                    <Chip
                                                        color="primary"
                                                        size="small"
                                                        variant="elevated"
                                                        label="Opened"
                                                    />
                                                )}
                                            </Typography>
                                            <Typography sx={{ mt: 0.4 }} color="text.secondary" variant="body2">
                                                {data.recipient.name} last {event.type === 'view' ? "viewed" : "opened"} on
                                                <AccessTimeIcon
                                                    sx={{
                                                        verticalAlign: 'middle',
                                                        marginRight: 0.2,
                                                        marginTop: -0.3,
                                                        marginLeft: 0.6,

                                                        fontSize: '1rem',
                                                    }}
                                                /> {new Date(event.date).toLocaleString(undefined, {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                })}
                                            </Typography>
                                        </CustomizedPaper3>
                                    )}
                                </TimelineContent>
                            </TimelineItem>
                        ))}


                </Timeline>
                )}
            </DialogContent>




            <DialogActions className="mt-4" sx={{ justifyContent: 'center' }}>
              
                <Button onClick={handlePrint} startIcon={<PrintIcon />} sx={{ mt: 4, }} className="no-print">
                    Print
                </Button>
            </DialogActions>
            <style>
                {`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                }
            `}
            </style>
        </Dialog>
    );
}

export default AuditTrail;
