import { NextFunction, Request, Response } from "express";

import User from "../models/User";

const getUserHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    const userData = await User.findOne({ userId });

    if (!userData) {
      res.status(404).send({ result: "Not Found" });
      return;
    }

    res.status(200).send({ result: "ok", userData });
  } catch (err) {
    next(err);
  }
};

const postUserHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const { tabUrl } = req.body;
    const images = req.files as any;

    const parsedUrl = new URL(tabUrl);
    const pageName = parsedUrl.host;
    const tabUrlName = tabUrl.replace(parsedUrl.origin, "");

    const newHistory = {
      historyName: new Date().toLocaleString("ko-KR"),
      imageUrls: [images[0].location, images[1].location],
      date: new Date().toLocaleString("ko-KR"),
    };

    const userData = await User.findOne({ userId });

    if (!userData) {
      await User.create({
        userId,
        pageNames: [
          {
            pageName,
            tabUrls: [
              {
                tabUrlName,
                history: [newHistory],
              },
            ],
          },
        ],
      });

      res.status(200).send({ result: "New data posted successfully" });
      return;
    }

    const pageIndex = userData.pageNames.findIndex(
      (page) => page.pageName === pageName,
    );

    if (pageIndex !== -1) {
      const tabIndex = userData.pageNames[pageIndex].tabUrls.findIndex(
        (tab) => tab.tabUrlName === tabUrlName,
      );

      if (tabIndex !== -1) {
        userData.pageNames[pageIndex].tabUrls[tabIndex].history.push(
          newHistory,
        );
      } else {
        userData.pageNames[pageIndex].tabUrls.push({
          tabUrlName,
          history: [newHistory],
        });
      }
    } else {
      userData.pageNames.push({
        pageName,
        tabUrls: [
          {
            tabUrlName,
            history: [newHistory],
          },
        ],
      });
    }

    await userData.save();
    res.status(200).send({ result: "Posted successfully" });
  } catch (err) {
    next(err);
  }
};

const deletePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, pageName } = req.body;

    const userData = await User.findOne({ userId });

    if (!userData) {
      res.status(404).send({ result: "User not found" });
      return;
    }

    const initialPageNamesLength = userData.pageNames.length;
    userData.pageNames = userData.pageNames.filter(
      (page) => page.pageName !== pageName,
    );

    if (userData.pageNames.length === initialPageNamesLength) {
      res.status(404).send({ result: "Page not found" });
      return;
    }

    await userData.save();

    res.status(200).send({ result: "Page deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteTabUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, pageName, tabUrlName } = req.body;

    const userData = await User.findOne({ userId });

    if (!userData) {
      res.status(404).send({ result: "User not found" });
      return;
    }

    const page = userData.pageNames.find((page) => page.pageName === pageName);

    if (!page) {
      res.status(404).send({ result: "Page not found" });
      return;
    }

    const initialTabUrlsLength = page.tabUrls.length;
    page.tabUrls = page.tabUrls.filter((tab) => tab.tabUrlName !== tabUrlName);

    if (page.tabUrls.length === initialTabUrlsLength) {
      res.status(404).send({ error: "Tab URL not found" });
      return;
    }

    await userData.save();

    res.status(200).send({ result: "Tab URL deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, pageName, tabUrlName, historyName } = req.body;
    const userdata = await User.findOne({ userId });

    if (!userdata) {
      res.status(404).send({ result: "User not found" });
      return;
    }

    const page = userdata.pageNames.find((page) => page.pageName === pageName);

    if (!page) {
      res.status(404).send({ result: "Page not found" });
      return;
    }

    const tab = page.tabUrls.find((tab) => tab.tabUrlName === tabUrlName);

    if (!tab) {
      res.status(404).send({ result: "Tab URL not found" });
      return;
    }

    const initialHistoryLength = tab.history.length;
    tab.history = tab.history.filter(
      (history) => history.historyName !== historyName,
    );

    if (tab.history.length === initialHistoryLength) {
      res.status(404).send({ result: "History not found" });
      return;
    }

    await userdata.save();

    res.status(200).send({ result: "History deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export {
  getUserHistory,
  postUserHistory,
  deletePage,
  deleteTabUrl,
  deleteHistory,
};
