import {
  ProjectManagement,
  sequelize,
  Sequelize,
  Task,
  UserAuth,
} from "../../models";

export const createProject = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const devId = req?.user?.id;
    const payload = { ...req.body, devId };

    const nameAlreadyExist = await ProjectManagement.findOne({
      where: { title: req.body.title, devId },
      transaction: t,
    });

    if (nameAlreadyExist) {
      await t.rollback();
      return res.status(200).send({ msg: "Name Already Exist" });
    } else {
      console.log("createProject Req.body - ", req.body);
      const createQuery = await ProjectManagement.create(payload, {
        transaction: t,
      });
      const updatedQuery = await ProjectManagement.findOne({
        where: { id: createQuery.id },
        order: [["id", "Asc"]],
        transaction: t,
      });
      await t.commit();
      return res.status(200).send({ msg: "success", query: updatedQuery });
    }
  } catch (error) {
    // await t.rollback();
    console.error("Error - ", error);
    return res.status(500).send({ error: error.message });
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page);
    const itemsPerPage = parseInt(req.query.pageSize);

    const devId = req?.user?.id;
    const query = await ProjectManagement.findAndCountAll({
      attributes: {
        exclude: ["createdAt"],
      },
      include: [
        {
          model: UserAuth,
          as: "UserAuth",
          attributes: {
            exclude: ["updatedAt", "password"],
          },
        },
        {
          model: Task,
          as: "projectTask",
          required: false,
          attributes: { exclude: ["updatedAt", "password"] },
          where: { devId: devId },
        },
      ],
      where: { devId: devId },
      offset: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
      order: [["id", "Asc"]],
    });

    const totalPages = Math.ceil(query.count / itemsPerPage);
    // console.log("query - ", query.count, totalPages);
    return res
      .status(200)
      .send({ msg: "success", query: query.rows, totalPages: totalPages });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    // console.log("----------- updateProject");
    const devId = req?.user?.id;
    const { title, description, status } = req.body;
    // console.log("-----------> ",  title, description, status);
    const nameAlreadyExist = await ProjectManagement.findOne({
      where: { title: title, id: req.params.id },
      transaction: t,
    });

    if (nameAlreadyExist) {
      await t.rollback();
      return res.status(200).send({ msg: "Name Already Exist" });
    } else {
      const [updated] = await ProjectManagement.update(
        {
          title,
          description,
          status,
          updatedAt: new Date(),
        },
        {
          where: { id: req.params.id, devId },
          transaction: t,
        }
      );

      // Check if any rows were updated
      if (updated) {
        await t.commit();
        // Fetch the updated record
        const query = await ProjectManagement.findOne({
          where: { id: req.params.id, devId: devId },
        });

        return res.status(200).send({ msg: "success", query });
      } else {
        await t.rollback();
        return res.status(404).send({ msg: "Record not found" });
      }
    }
  } catch (error) {
    await t.rollback();
    return res.status(500).send({ error: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const devId = req?.user?.id;
    // console.log("Delete req  devId ", devId);
    // console.log("params - ", req.params);
    // console.log("query - ", req.query);

    const query = await ProjectManagement.destroy({
      where: { id: req.params.id, devId },
      transaction: t,
    });

    if (query === 0) {
      await t.rollback();
      return res.status(404).send({ msg: "Record not found" });
    }

    // console.log("query Delete - ", query);
    await t.commit();
    return res.status(200).send({ msg: "success" });
  } catch (error) {
    await t.rollback();
    return res.status(500).send({ error: error.message });
  }
};
