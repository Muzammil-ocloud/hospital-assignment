import { Request, Response } from "express";
import { Appointment } from "../models/appointment";
import { getWeekRange, getMonthRange, getStartOfDay, getEndOfDay } from "../utils/date.utils";
import { getAmountInUSD } from "../utils/utils";

export const getWeeklyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = getWeekRange(1);
    const appointments = await Appointment.find({
      startTime: { $gte: getStartOfDay(startDate), $lte: getEndOfDay(endDate) },
    });
    const totalAmount = await appointments.reduce(async (total, appointment) => {
      const amountInUSD = await getAmountInUSD(appointment.amount, appointment.paymentMethod);
      const paidAmountInUSD = await getAmountInUSD(appointment.paidAmount, appointment.paymentMethod);

      return {
        paid: (await total).paid + paidAmountInUSD,
        amount: (await total).amount + amountInUSD,
      };
    }, Promise.resolve({ paid: 0, amount: 0 }));

    const remainingAmount = totalAmount.amount - totalAmount.paid;
    res.status(200).json({ paid: totalAmount.paid, unpaid: remainingAmount, balance: totalAmount.amount });
  } catch (error: any) {
    res.status(400).json({
      message: "Error getting report",
      error: error.message,
    });
  }
};

export const getMonthlyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = getMonthRange(1);
    const appointments = await Appointment.find({
      startTime: { $gte: getStartOfDay(startDate), $lte: getEndOfDay(endDate) },
    });
    const totalAmount = await appointments.reduce(async (total, appointment) => {
      const amountInUSD = await getAmountInUSD(appointment.amount, appointment.paymentMethod);
      const paidAmountInUSD = await getAmountInUSD(appointment.paidAmount, appointment.paymentMethod);

      return {
        paid: (await total).paid + paidAmountInUSD,
        amount: (await total).amount + amountInUSD,
      };
    }, Promise.resolve({ paid: 0, amount: 0 }));

    const remainingAmount = totalAmount.amount - totalAmount.paid;
    res.status(200).json({ paid: totalAmount.paid, unpaid: remainingAmount, balance: totalAmount.amount });
  } catch (error: any) {
    res.status(400).json({
      message: "Error getting report",
      error: error.message,
    });
  }
};

export const getPatientsReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const patientsReport = await Appointment.aggregate([
      {
        $group: {
          _id: "$patient",
          amount: { $sum: "$amount" },
          paymentMethod: { $first: "$paymentMethod" },
        },
      },
      {
        $lookup: {
          from: "patients",
          localField: "_id",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: "$patient",
      },
      {
        $sort: {
          amount: -1,
        },
      },
    ]);
    const finalReport = await Promise.all(
      patientsReport.map(async (patient) => {
        const { paymentMethod, amount, _id } = patient;
        const { petName } = patient.patient;
        return {
          _id: _id,
          petName: petName,
          amount: await getAmountInUSD(amount, paymentMethod),
        };
      })
    );
    res.status(200).json({ popularPet: finalReport[0], allPets: finalReport });
  } catch (error: any) {
    res.status(400).json({
      message: "Error getting patients report",
      error: error.message,
    });
  }
};
