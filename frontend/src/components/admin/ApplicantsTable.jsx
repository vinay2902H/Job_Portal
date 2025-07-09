import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';

const shortlistingStatus = ['Accepted', 'Rejected'];

const ApplicantsTable = () => {
  const { applicants } = useSelector(store => store.application);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });

      if (res.data.success) {
        toast.success(res.data.message);

        const updatedApplication = applicants.applications.find(app => app._id === id);

        if (updatedApplication) {
          const { email, fullname, profile } = updatedApplication.applicant;
          const resumeLink = profile?.resume;
          const originalName = profile?.resumeOriginalName;

          const emailData = {
            email,
            subject: status === 'Accepted' ? 'Application Accepted' : 'Application Rejected',
            message: status === 'Accepted'
              ?`Dear ${fullname},

Congratulations! 🎉

We are pleased to inform you that your application has been **accepted**. Your qualifications and experience have impressed our team, and we are excited about the possibility of you joining us.

Next steps will be communicated to you shortly. If you have any questions, feel free to reach out.

Best regards,  
Job Portal Team`

              : `Dear ${fullname},

Thank you for taking the time to apply for the position. We appreciate your interest in the opportunity and the effort you put into your application.

After careful consideration, we regret to inform you that your application has **not been selected** at this time.

We encourage you to apply for future openings that match your profile. Wishing you all the best in your job search and career ahead.

Warm regards,  
Job Portal Team`

          };

          const response = await fetch(`http://localhost:8000/api/email/sendEmail`, {
            method: 'POST',
            body: JSON.stringify(emailData),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to send email: ${response.statusText}`);
          }

          toast.success('Email sent successfully!');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update status or send email.');
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recently applied users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>FullName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants?.applications?.map(item => (
            <TableRow key={item._id}>
              <TableCell>{item.applicant?.fullname}</TableCell>
              <TableCell>{item.applicant?.email}</TableCell>
              <TableCell>{item.applicant?.phoneNumber}</TableCell>
              <TableCell>
                {item.applicant?.profile?.resume ? (
                  <a
                    className="text-blue-600 cursor-pointer"
                    href={item.applicant.profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.applicant.profile.resumeOriginalName}
                  </a>
                ) : (
                  <span>NA</span>
                )}
              </TableCell>
              <TableCell>{item.applicant.createdAt.split('T')[0]}</TableCell>
              <TableCell className="float-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    {shortlistingStatus.map((status, index) => (
                      <div
                        key={index}
                        className="flex w-fit items-center my-2 cursor-pointer"
                        onClick={() => statusHandler(status, item._id)}
                      >
                        <span>{status}</span>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
