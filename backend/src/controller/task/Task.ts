import { sequelize, Sequelize, Task, UserAuth } from "../../models";

export const createTask = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    // 	id	title	description	status	dueDate	createdAt	updatedAt	devId	projectId

    const devId = req?.user?.id;

    const { title, description, status, dueDate, projectId } = req.body;

    const nameAlreadyExist = await Task.findOne({
      where: { title: req.body.title, devId },
      transaction: t,
    });

    if (nameAlreadyExist) {
      await t.rollback();
      return res.status(200).send({ msg: "Name Already Exist" });
    } else {
      // console.log("Req.body - ", req.body);
      const createQuery = await Task.create(
        {
          title: title,
          description: description,
          status: status,
          dueDate: dueDate,
          devId: devId,
          projectId: projectId,
        },
        {
          transaction: t,
        }
      );
      const updatedQuery = await Task.findOne({
        where: { id: createQuery.id },
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

export const getTask = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page);
    const itemsPerPage = parseInt(req.query.pageSize);

    const devId = req?.user?.id;
    const query = await Task.findAndCountAll({
      attributes: {
        exclude: ["createdAt"],
      },
      include: {
        model: UserAuth,
        as: "UserAuth",
        attributes: {
          exclude: ["updatedAt", "password"],
        },
      },
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

export const updateTask = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    // console.log("----------- updateProject");
    const devId = req?.user?.id;
    const { title, description, status, dueDate } = req.body;
    // console.log("-----------> ",  title, description, status);
    const nameAlreadyExist = await Task.findOne({
      where: { title: title, id: req.params.id },
      transaction: t,
    });

    if (nameAlreadyExist) {
      await t.rollback();
      return res.status(200).send({ msg: "Name Already Exist" });
    } else {
      const [updated] = await Task.update(
        {
          title,
          description,
          status,
          dueDate,
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
        const query = await Task.findOne({
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

export const deleteTask = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const devId = req?.user?.id;

    console.log("Delete req  devId ", devId);
    console.log("params - ", req.params.id);

    const query = await Task.destroy({
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
